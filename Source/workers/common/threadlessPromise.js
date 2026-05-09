/*build:remove*/
/*eslint no-unused-vars: "error"*/
/*exported ThreadLessPromise*/
const engine = {};
/*build:end*/

const ThreadLessPromise = class {
    constructor(count, completion) {
        this.count = count;
        this.completions = 0;
        this.completion = completion;
    }

    complete() {
        this.completions += 1;
        engine.logd(`Completed cleanup ${this.completions}/${this.count}`);
        if (this.completions >= this.count) {
            this.completion();
        }
    }
};


this.export.ThreadLessPromise = ThreadLessPromise;