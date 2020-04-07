const Name = function (firstName, middleName) {
    this.firstName = firstName;
    this.middleName = middleName;
    this.intireName = function () {
        console.log(this.firstName.concat(this.middleName));
    };
};

const n = new Name('Olavo', 'Kruel');

Name.prototype.intireName2 = function () {
    console.log('My name is' + ' ' + this.firstName.concat(this.middleName));
    this.test = true;
    return this;
};

Name.prototype.intireName3 = function () {
    console.log(this, this.test);
};

n.intireName2().intireName3();

