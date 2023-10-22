export class Book {
    name;
    author;
    imgUrl;
    description;
    category;

    constructor(name, author, imgUrl, desc, category) {
        this.name = name;
        this.author = author;
        this.imgUrl = imgUrl;
        this.description = desc;
        this.category = category;
    }
}

export class JoinUs {
    fullName;
    emailAddress;

    constructor(fullName, email) {
        this.fullName = fullName;
        this.emailAddress = email;
    }
}

export class ContactUs {
    fullName;
    address;
    emailAddress;
    phoneNumber;

    constructor(fullName, address, email, phone) {
        this.fullName = fullName;
        this.address = address;
        this.emailAddress = email;
        this.phoneNumber = phone
    }
}