class Greetings {
    english() { return 'Hello'; };
    portugues() { return 'Ola'; };
};

class MoreGreetings {
    static build() {
        const greetings = new Greetings();
        const moreGreetings = new MoreGreetings();

        const allGreetings = new Proxy(moreGreetings, {
            get: function (target, property) {
                return target[property] || greetings[property];
            }
        });
        return allGreetings;
    };
    french() { return 'Bounjour'; };
    dutch() { return 'Hallo'; };
};

const allGreetings = MoreGreetings.build();

console.log(allGreetings.portugues());
console.log(allGreetings.english());
console.log(allGreetings.french());
console.log(allGreetings.dutch());