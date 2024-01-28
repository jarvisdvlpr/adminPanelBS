export class Book {
  name;
  author;
  imgUrl;
  description;
  category;
  id;
  comments;
  isBestseller;
  isNew;

  constructor(name, author, imgUrl, desc, category, id,comments,
              isBestseller=false, isNew=false) {
    this.name = name;
    this.author = author;
    this.imgUrl = imgUrl;
    this.description = desc;
    this.category = category;
    this.id = id;
    this.comments = comments;
    this.isBestseller =isBestseller;
    this.isNew = isNew;
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
  note;

  constructor(fullName, address, email, phone, note) {
    this.fullName = fullName;
    this.address = address;
    this.emailAddress = email;
    this.phoneNumber = phone;
    this.note = note;
  }
}

export class AboutUs {
  title;
  description;
  imgSrc;

  constructor(title, desc, imgSrc) {
    this.title = title;
    this.description = desc;
    this.imgSrc = imgSrc;
  }
}