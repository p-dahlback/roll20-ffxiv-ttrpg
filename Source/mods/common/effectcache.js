/*build:remove*/
/*eslint no-unused-vars: "error"*/
let effectData = {}; let effectUtilities = {}; const Logger = {};
/*build:end*/

const TokenEffectData = function(id, marker=null, managed=true) {
    this.id = id;
    this.marker = marker;
    this.managed = managed;
};

const TokenEffects = function(logger, token, obj=null) {
    this.getStatusMarkers = function() {
        let statusmarkers = this.token.get("statusmarkers");
        if (statusmarkers) {
            return statusmarkers.split(",");
        }
        return [];
    };

    if (obj) {
        Object.assign(this, obj);
        this.logger = logger;
        this.token = token;
    } else {
        this.token = token;
        this.logger = logger;
        this.effectsById = {};

        this.markersToAdd = {};
        this.markerMap = [];

        let currentMarkers = this.getStatusMarkers();
        for (let marker of currentMarkers) {
            this.markerMap.push(new TokenEffectData(null, marker, false));
        }
    }

    this.set = function(id, property, value) {
        let effect;
        if (this.effectsById[id]) {
            effect = this.effectsById[id];
        } else {
            effect = new TokenEffectData(id);
            this.effectsById[id] = effect;
        }
        
        if (property === "type" || property === "specialType") {
            let searchableName = effectUtilities.searchableName(value);
            let data = effectData.effects[searchableName];
            if (data && data.marker) {
                // Created a new status marker
                var markers = this.getStatusMarkers();
                let availableMarkers = JSON.parse(Campaign().get("token_markers") || "[]");
                let markerObject = availableMarkers.find(marker => marker.name === data.marker );
                if (!markerObject) {
                    this.logger.d(`Couldn't find status marker ${data.marker}`);
                } else {
                    let tag = markerObject.tag;
                    markers.push(tag);
                    token.set("statusmarkers", markers.join(","));
                    effect.marker = tag;

                    this.markerMap.push(effect);
                    this.logger.d(`Updated status markers for ${id} - '${markers}'`);
                }
            }
        }
        this.effectsById[id][property] = value;
    };

    this.remove = function(id, stopRecursion=false) {
        this.logger.d("Removing status marker with id " + id);
        var markers = this.getStatusMarkers();
        if (markers.length != this.markerMap.length) {
            this.logger.d("Number of markers is inconsistent");
            this.reconfigureMarkerMap(markers);
        }

        for (let index in this.markerMap) {
            let effect = this.markerMap[index];

            if (effect.marker !== markers[index]) {
                this.logger.d("Marker contents are inconsistent");

                // Reconfigure and rerun operation
                this.reconfigureMarkerMap(markers);
                if (stopRecursion) {
                    this.logger.i(`Couldn't remove marker for effect ${id}; unresolvable inconsistencies with status marker list 
                        (${JSON.stringify(markers)}) vs (${JSON.stringify(this.markerMap)})`);
                    if (this.effectsById[id]) {
                        delete this.effectsById[id];
                    }
                } else {
                    this.remove(id, true);
                }
                return;
            }

            if (effect.id === id) {
                markers.splice(index, 1);
                this.markerMap.splice(index, 1);
                break;
            }
        }
        token.set("statusmarkers", markers.join(","));

        if (this.effectsById[id]) {
            delete this.effectsById[id];
        }
    };

    this.getEffects = function() {
        return this.markerMap;
    };

    this.reconfigureMarkerMap = function(markers=null) {
        this.logger.d("Reconfiguring markers");
        if (!markers) {
            markers = this.getStatusMarkers();
        }
        var managedMarkers = this.markerMap.filter(value => value.managed);
        var newMarkerMap = [];
        let markerNames = managedMarkers.map(m => m.marker);
        for (let marker of markers) {
            this.logger.d(`Compare: ${marker} to ${JSON.stringify(markerNames)}`);
            let foundMatch = false;
            for (let index in managedMarkers) {
                let managedMarker = managedMarkers[index];
                if (marker === managedMarker.marker) {
                    this.logger.d(`Cached marker: ${marker} (${JSON.stringify(managedMarker)})`);
                    newMarkerMap.push(managedMarker);
                    foundMatch = true;

                    // Discard all managed markers up until this match
                    managedMarkers.splice(0, index + 1);
                    break;
                }
            }
            if (!foundMatch) {
                // This marker is unmanaged
                this.logger.d("Unmanaged marker: " + marker);
                newMarkerMap.push(new TokenEffectData(null, marker, false));
            }
        }
        if (managedMarkers.length > 0) {
            for (let leftoverMarker of managedMarkers) {
                if (this.effectsById[leftoverMarker.id]) {
                    this.logger.d("Deleting missing cached effect " + JSON.stringify(leftoverMarker));
                    delete this.effectsById[leftoverMarker.id];
                }
            }
        }
        this.markerMap = newMarkerMap;
        this.logger.d("New state: " + JSON.stringify(newMarkerMap.map(value => { return `${value.marker}` + (value.managed ? "" : "-unmanaged"); })));
    };
};

const EffectCache = function(obj=null) {
    if (obj) {
        Object.assign(this, obj);
    } else {
        this.cacheByToken = {};
    }
    this.logger = new Logger("FFXIVCache", true);

    this.get = function(token) {
        let id = token.get("_id");
        if (!this.cacheByToken[id]) {
            this.cacheByToken[id] = new TokenEffects(this.logger, token);
            return this.cacheByToken[id];
        } else if (this.cacheByToken[id] instanceof TokenEffects) {
            return this.cacheByToken[id];
        } else {
            this.cacheByToken[id] = new TokenEffects(this.logger, token, this.cacheByToken[id]);
            return this.cacheByToken[id];
        }
    };

    this.remove = function(token) {
        let id = token.get("_id");
        if (this.cacheByToken[id]) {
            delete this.cacheByToken[id];
        }
    };
};

this.export.TokenEffectData = TokenEffectData;
this.export.TokenEffects = TokenEffects;
this.export.EffectCache = EffectCache;