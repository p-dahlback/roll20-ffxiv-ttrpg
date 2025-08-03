/*build:remove*/
/*eslint no-unused-vars: "error"*/
/*exported generateRowID, unpackAttribute, setAttribute*/
/*build:end*/
function generateUUID() {
    let a = 0;
    let b = [];
    return () => {
        let c = (new Date()).getTime() + 0;
        let f = 7;
        let e = new Array(8);
        let d = c === a;
        a = c;
        for (; 0 <= f; f--) {
            e[f] = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(c % 64);
            c = Math.floor(c / 64);
        }
        c = e.join("");
        if (d) {
            for (f = 11; 0 <= f && 63 === b[f]; f--) {
                b[f] = 0;
            }
            b[f]++;
        } else {
            for (f = 0; 12 > f; f++) {
                b[f] = Math.floor(64 * Math.random());
            }
        }
        for (f = 0; 12 > f; f++) {
            c += "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(b[f]);
        }
        return c;
    };
}

/*eslint-disable-next-line no-redeclare*/
function generateRowID() { generateUUID().replace(/_/g, "Z"); }

function unpackAttribute(character, name, defaultValue) {
    let attribute = findObjs({ type: "attribute", characterid: character.id, name: name });
    if (!attribute || attribute.length == 0) {
        return {
            fake: {
                name: name,
                characterid: character.id
            },
            get: (key) => {
                if (key === "name") {
                    return name;
                }
                if (key === "current") {
                    return defaultValue;
                }
                return "";
            }
        };
    }
    return attribute[0];
}

/*eslint-disable-next-line no-unused-vars*/
function setAttribute(attribute, key, value) {
    if (attribute.fake) {
        var settings = {
            name: attribute.fake.name,
            characterid: attribute.fake.characterid
        };
        settings[key] = value;
        createObj("attribute", settings);
    } else {
        attribute.set(key, value);
    }
}