'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.bulkInsert('Users', [
      {
        login: 'firstdemouser',
        email: 'firstdemouser@gmail.com',
        passwordHash: '$2b$10$OjvQ4U/mcW38T4y4cH54I.2vHLJ3Qz.3jEYADw0sVbQVZrBjKAqg.',
        createdAt: new Date(),
      },
      {
        login: 'seconddemouser',
        email: 'seconddemouser@gmail.com',
        passwordHash: '$2b$10$OjvQ4U/mcW38T4y4cH54I.2vHLJ3Qz.3jEYADw0sVbQVZrBjKAqg.',
        createdAt: new Date(),
      },
      {
        login: 'thirddemouser',
        email: 'thirddemouser@gmail.com',
        passwordHash: '$2b$10$OjvQ4U/mcW38T4y4cH54I.2vHLJ3Qz.3jEYADw0sVbQVZrBjKAqg.',
        createdAt: new Date(),
      },
      {
        login: 'fourthdemouser',
        email: 'fourthdemouser@gmail.com',
        passwordHash: '$2b$10$OjvQ4U/mcW38T4y4cH54I.2vHLJ3Qz.3jEYADw0sVbQVZrBjKAqg.',
        createdAt: new Date(),
      },
      {
        login: 'fifthdemouser',
        email: 'fifthdemouser@gmail.com',
        passwordHash: '$2b$10$OjvQ4U/mcW38T4y4cH54I.2vHLJ3Qz.3jEYADw0sVbQVZrBjKAqg.',
        createdAt: new Date(),
      },
      {
        login: 'sixthdemouser',
        email: 'sixthdemouser@gmail.com',
        passwordHash: '$2b$10$OjvQ4U/mcW38T4y4cH54I.2vHLJ3Qz.3jEYADw0sVbQVZrBjKAqg.',
        createdAt: new Date(),
      },
      {
        login: 'seventhdemouser',
        email: 'seventhdemouser@gmail.com',
        passwordHash: '$2b$10$OjvQ4U/mcW38T4y4cH54I.2vHLJ3Qz.3jEYADw0sVbQVZrBjKAqg.',
        createdAt: new Date(),
      },
      {
        login: 'eighthdemouser',
        email: 'eighthdemouser@gmail.com',
        passwordHash: '$2b$10$OjvQ4U/mcW38T4y4cH54I.2vHLJ3Qz.3jEYADw0sVbQVZrBjKAqg.',
        createdAt: new Date(),
      },
    ], {});

    await queryInterface.bulkInsert('UserInformation', [
      {
        userId: await queryInterface.rawSelect('Users', {where: {login: 'firstdemouser'}}, ['id']),
        firstName: 'Шинкарено',
        lastName: 'Юлія',
        gender: 'FEMALE',
      },
      {
        userId: await queryInterface.rawSelect('Users', {where: {login: 'seconddemouser'}}, ['id']),
        firstName: 'Дмитрено',
        lastName: 'Олексій',
        gender: 'MALE',
      },
      {
        userId: await queryInterface.rawSelect('Users', {where: {login: 'thirddemouser'}}, ['id']),
        firstName: 'Іван',
        lastName: 'Лисенко',
        gender: 'MALE',
        about: 'Люблю активно віпочивати, а також риболовлю.',
        profileHeader: 'Усім привіт!!!'
      },
      {
        userId: await queryInterface.rawSelect('Users', {where: {login: 'fourthdemouser'}}, ['id']),
        firstName: 'В\'ячеслав',
        lastName: 'Василів',
        gender: 'MALE',
        birthdate: '1999-01-21 00:00:00',
        about: 'Всім привіт, я В\'ячеслав. Люблю спорт і машини...',
      },
      {
        userId: await queryInterface.rawSelect('Users', {where: {login: 'fifthdemouser'}}, ['id']),
        firstName: 'Артур',
        lastName: 'Антоненко',
        gender: 'MALE',
      },
      {
        userId: await queryInterface.rawSelect('Users', {where: {login: 'sixthdemouser'}}, ['id']),
        firstName: 'Антон',
        lastName: 'Артуренко',
        birthdate: '1980-04-01 00:00:00',
      },
      {
        userId: await queryInterface.rawSelect('Users', {where: {login: 'seventhdemouser'}}, ['id']),
        firstName: 'Надія',
        lastName: 'Гончаренко',
      },
      {
        userId: await queryInterface.rawSelect('Users', {where: {login: 'eighthdemouser'}}, ['id']),
        firstName: 'Микита',
        lastName: 'Марченко',
        birthdate: '1988-11-11 00:00:00',
      },

    ], {});

    await queryInterface.bulkInsert('UserAddresses', [
      {
        userId: await queryInterface.rawSelect('Users', {where: {login: 'firstdemouser'}}, ['id']),
        countryId: await queryInterface.rawSelect('Countries', {where: {iso: 'UKR'}}, ['id']),
        city: 'Kyiv',
        zipCode: '03023',
        address: 'Борщагівська 120'
      },
      {
        userId: await queryInterface.rawSelect('Users', {where: {login: 'seconddemouser'}}, ['id']),
        countryId: await queryInterface.rawSelect('Countries', {where: {iso: 'UKR'}}, ['id']),
        city: 'Lviv',
        zipCode: '04012',
      },
      {
        userId: await queryInterface.rawSelect('Users', {where: {login: 'thirddemouser'}}, ['id']),
        countryId: await queryInterface.rawSelect('Countries', {where: {iso: 'UKR'}}, ['id']),
        city: 'Odessa',
        zipCode: '05501',
        address: 'Першотравнева 12, будинок 13'
      },
      {
        userId: await queryInterface.rawSelect('Users', {where: {login: 'fourthdemouser'}}, ['id']),
        countryId: await queryInterface.rawSelect('Countries', {where: {iso: 'UKR'}}, ['id']),
        city: 'Dnipro',
        zipCode: '08253',
        address: 'Вулиця Героїв, будинок 9, квартира 30',
        additionalAddress: 'Вишнева 10'
      },
      {
        userId: await queryInterface.rawSelect('Users', {where: {login: 'fifthdemouser'}}, ['id']),
        countryId: await queryInterface.rawSelect('Countries', {where: {iso: 'USA'}}, ['id']),
        city: 'New York',
        zipCode: '666666',
      },
      {
        userId: await queryInterface.rawSelect('Users', {where: {login: 'sixthdemouser'}}, ['id']),
        countryId: await queryInterface.rawSelect('Countries', {where: {iso: 'UKR'}}, ['id']),
        city: 'Lviv',
        zipCode: '03045',
      },
      {
        userId: await queryInterface.rawSelect('Users', {where: {login: 'seventhdemouser'}}, ['id']),
        countryId: await queryInterface.rawSelect('Countries', {where: {iso: 'UKR'}}, ['id']),
        city: 'Kherson',
        zipCode: '602000',
      },
      {
        userId: await queryInterface.rawSelect('Users', {where: {login: 'eighthdemouser'}}, ['id']),
        countryId: await queryInterface.rawSelect('Countries', {where: {iso: 'UKR'}}, ['id']),
        city: 'Kherson',
        zipCode: '602000',
      },
    ], {});

    await queryInterface.bulkInsert('FavoritePhotocards', [
      {
        userId: await queryInterface.rawSelect('Users', {where: {login: 'firstdemouser'}}, ['id']),
        photocardId: await queryInterface.rawSelect('Photocards', {where: {fileName: 'bar.jpg'}}, ['id']),
      },
      {
        userId: await queryInterface.rawSelect('Users', {where: {login: 'firstdemouser'}}, ['id']),
        photocardId: await queryInterface.rawSelect('Photocards', {where: {fileName: 'bike.jpg'}}, ['id']),
      },
      {
        userId: await queryInterface.rawSelect('Users', {where: {login: 'firstdemouser'}}, ['id']),
        photocardId: await queryInterface.rawSelect('Photocards', {where: {fileName: 'mouse.jpg'}}, ['id']),
      },
      {
        userId: await queryInterface.rawSelect('Users', {where: {login: 'seconddemouser'}}, ['id']),
        photocardId: await queryInterface.rawSelect('Photocards', {where: {fileName: 'woman.jpg'}}, ['id']),
      },
      {
        userId: await queryInterface.rawSelect('Users', {where: {login: 'seconddemouser'}}, ['id']),
        photocardId: await queryInterface.rawSelect('Photocards', {where: {fileName: 'tropics.jpg'}}, ['id']),
      },
      {
        userId: await queryInterface.rawSelect('Users', {where: {login: 'fourthdemouser'}}, ['id']),
        photocardId: await queryInterface.rawSelect('Photocards', {where: {fileName: 'rain.jpg'}}, ['id']),
      },
      {
        userId: await queryInterface.rawSelect('Users', {where: {login: 'fourthdemouser'}}, ['id']),
        photocardId: await queryInterface.rawSelect('Photocards', {where: {fileName: 'town.jpg'}}, ['id']),
      },
      {
        userId: await queryInterface.rawSelect('Users', {where: {login: 'fourthdemouser'}}, ['id']),
        photocardId: await queryInterface.rawSelect('Photocards', {where: {fileName: 'leaf.jpg'}}, ['id']),
      },
      {
        userId: await queryInterface.rawSelect('Users', {where: {login: 'fourthdemouser'}}, ['id']),
        photocardId: await queryInterface.rawSelect('Photocards', {where: {fileName: 'cameras.jpg'}}, ['id']),
      },
      {
        userId: await queryInterface.rawSelect('Users', {where: {login: 'fourthdemouser'}}, ['id']),
        photocardId: await queryInterface.rawSelect('Photocards', {where: {fileName: 'blue_water.jpg'}}, ['id']),
      },
      {
        userId: await queryInterface.rawSelect('Users', {where: {login: 'fourthdemouser'}}, ['id']),
        photocardId: await queryInterface.rawSelect('Photocards', {where: {fileName: 'tropics.jpg'}}, ['id']),
      },
      {
        userId: await queryInterface.rawSelect('Users', {where: {login: 'fifthdemouser'}}, ['id']),
        photocardId: await queryInterface.rawSelect('Photocards', {where: {fileName: 'bar.jpg'}}, ['id']),
      },
      {
        userId: await queryInterface.rawSelect('Users', {where: {login: 'fifthdemouser'}}, ['id']),
        photocardId: await queryInterface.rawSelect('Photocards', {where: {fileName: 'bike.jpg'}}, ['id']),
      },
      {
        userId: await queryInterface.rawSelect('Users', {where: {login: 'fifthdemouser'}}, ['id']),
        photocardId: await queryInterface.rawSelect('Photocards', {where: {fileName: 'town.jpg'}}, ['id']),
      },
      {
        userId: await queryInterface.rawSelect('Users', {where: {login: 'fifthdemouser'}}, ['id']),
        photocardId: await queryInterface.rawSelect('Photocards', {where: {fileName: 'mouse.jpg'}}, ['id']),
      },
      {
        userId: await queryInterface.rawSelect('Users', {where: {login: 'fifthdemouser'}}, ['id']),
        photocardId: await queryInterface.rawSelect('Photocards', {where: {fileName: 'woman.jpg'}}, ['id']),
      },
      {
        userId: await queryInterface.rawSelect('Users', {where: {login: 'fifthdemouser'}}, ['id']),
        photocardId: await queryInterface.rawSelect('Photocards', {where: {fileName: 'leaf.jpg'}}, ['id']),
      },
      {
        userId: await queryInterface.rawSelect('Users', {where: {login: 'fifthdemouser'}}, ['id']),
        photocardId: await queryInterface.rawSelect('Photocards', {where: {fileName: 'blue_water.jpg'}}, ['id']),
      },
    ], {});

    await queryInterface.bulkInsert('UserTokens', [
      {userId: await queryInterface.rawSelect('Users', {where: {login: 'firstdemouser'}}, ['id'])},
      {userId: await queryInterface.rawSelect('Users', {where: {login: 'seconddemouser'}}, ['id'])},
      {userId: await queryInterface.rawSelect('Users', {where: {login: 'thirddemouser'}}, ['id'])},
      {userId: await queryInterface.rawSelect('Users', {where: {login: 'fourthdemouser'}}, ['id'])},
      {userId: await queryInterface.rawSelect('Users', {where: {login: 'fifthdemouser'}}, ['id'])},
      {userId: await queryInterface.rawSelect('Users', {where: {login: 'sixthdemouser'}}, ['id'])},
      {userId: await queryInterface.rawSelect('Users', {where: {login: 'seventhdemouser'}}, ['id'])},
      {userId: await queryInterface.rawSelect('Users', {where: {login: 'eighthdemouser'}}, ['id'])},
    ], {});

    await queryInterface.bulkInsert('UserPreferences', [
      {
        userId: await queryInterface.rawSelect('Users', {where: {login: 'thirddemouser'}}, ['id']),
        name: 'Смерека',
      },
      {
        userId: await queryInterface.rawSelect('Users', {where: {login: 'thirddemouser'}}, ['id']),
        name: 'Kalush Orchestra',
      },
      {
        userId: await queryInterface.rawSelect('Users', {where: {login: 'thirddemouser'}}, ['id']),
        name: 'Канапки',
      },
      {
        userId: await queryInterface.rawSelect('Users', {where: {login: 'thirddemouser'}}, ['id']),
        name: 'Біле нефільтроване',
      },
      {
        userId: await queryInterface.rawSelect('Users', {where: {login: 'thirddemouser'}}, ['id']),
        name: 'Банош',
      },
      {
        userId: await queryInterface.rawSelect('Users', {where: {login: 'thirddemouser'}}, ['id']),
        name: 'Літо',
      },
      {
        userId: await queryInterface.rawSelect('Users', {where: {login: 'thirddemouser'}}, ['id']),
        name: 'Кіно',
      },
      {
        userId: await queryInterface.rawSelect('Users', {where: {login: 'thirddemouser'}}, ['id']),
        name: 'Прогулянки',
      },
      {
        userId: await queryInterface.rawSelect('Users', {where: {login: 'thirddemouser'}}, ['id']),
        name: 'Танці',
      },
      {
        userId: await queryInterface.rawSelect('Users', {where: {login: 'thirddemouser'}}, ['id']),
        name: 'Гоа',
      },
      {
        userId: await queryInterface.rawSelect('Users', {where: {login: 'fifthdemouser'}}, ['id']),
        name: 'Катання на ковзанах',
      },
      {
        userId: await queryInterface.rawSelect('Users', {where: {login: 'fifthdemouser'}}, ['id']),
        name: 'Смачно поїсти',
      },
      {
        userId: await queryInterface.rawSelect('Users', {where: {login: 'fifthdemouser'}}, ['id']),
        name: 'Гори і ліса',
      },
      {
        userId: await queryInterface.rawSelect('Users', {where: {login: 'fifthdemouser'}}, ['id']),
        name: 'Бокс',
      },
    ], {});

    await queryInterface.bulkInsert('Reviews', [
      {
        tourId: await queryInterface.rawSelect('Tours', {where: {name: 'Дводенний сплав дельтою'}}, ['id']),
        userId: await queryInterface.rawSelect('Users', {where: {login: 'firstdemouser'}}, ['id']),
        userFullname: 'Шинкаренко Юлія',
        assessment: 5,
        text: `Їздили з подругою 10.09.2021-13.09.2021 в тур Обійми сонячного Закарпаття+Термали. Хочу виразити 
        свою подяку за добре організовану поїзду, все було супер. Окрема подяка водію Максиму за комфортну поїзду, 
        керівнику групі Ларисі за хорошу організацію та гіду Віктору за цікаві розповіді про Закарпаття. Ми 
        обов‘язково ще скористаємось послугами цієї компанії. Вже плануємо та чекаємо наступну поїздку теж.`,
        createdAt: new Date(),
      },
      {
        tourId: await queryInterface.rawSelect('Tours', {where: {name: 'Захід сонця на воді'}}, ['id']),
        userId: await queryInterface.rawSelect('Users', {where: {login: 'seconddemouser'}}, ['id']),
        userFullname: 'Дмитренко Олексій',
        assessment: 5,
        text: `Тур в каменец подильскии дуже сподобався рекомендую Кам’янець-Подільський + Хотин / тур вихідного дня 
        на Поділля з виїздом з Києва`,
        createdAt: new Date(),
      },
      {
        tourId: await queryInterface.rawSelect('Tours', {where: {name: 'Дводенний сплав дельтою'}}, ['id']),
        userId: await queryInterface.rawSelect('Users', {where: {login: 'thirddemouser'}}, ['id']),
        userFullname: 'Іван Лисенко',
        assessment: 4,
        text: `Замок Радомисль просто супер. Я розслабився та відпочив завдяки нашій супроводжуючій Марії, 
        відчувалася турбота про наш комфорт під час туру. Дякую! ЕКСКУРСІЯ В ЗАМОК РАДОМИСЛЬ + УКРАЇНСЬКЕ СЕЛО / 
        автобусний тур з Києва.`,
        createdAt: new Date(),
      },
      {
        tourId: await queryInterface.rawSelect('Tours', {where: {name: 'Ранкова прогулянка'}}, ['id']),
        userId: await queryInterface.rawSelect('Users', {where: {login: 'fourthdemouser'}}, ['id']),
        userFullname: 'B\'ячеслав Васильович',
        assessment: 5,
        text: `Чудовий тур Синевір+Шипіт зі Львова. Відвідували 23/08/2021 – дуже все сподобалося і окрема вдячність 
        фантастичному гіду Людмилі яка цікаво все розповідала і швидко вирішила проблему з автобусом і туристи 
        встигли на зворотні потяги/автобуси додому(дівчата з Полтави безмежно вдячні!;)) ОЗЕРО СИНЕВИР І ВОДОСПАД 
        ШИПІТ/ тур в Карпати зі Львова.`,
        createdAt: new Date(),
      },
      {
        tourId: await queryInterface.rawSelect('Tours', {where: {name: 'Ранкова прогулянка'}}, ['id']),
        userId: await queryInterface.rawSelect('Users', {where: {login: 'fifthdemouser'}}, ['id']),
        userFullname: 'Артур Антоненко',
        assessment: 5,
        text: `Хотілося б висловити подяку! Придбали тут два одноденні тури “ОЗЕРО СИНЕВИР І ВОДОСПАД ШИПІТ” та 
        “ТУСТАНЬ та водоспад КАМ’ЯНКА” і були дуже задоволені поїздками! Цікава розповідь від гіда про місто-фортецю 
        Тустань, чудові краєвиди з гори Гимба та захоплююча краса та сила водоспадів. Поїздки були комфортними. 
        Заповідник ТУСТАНЬ та водоспад КАМ’ЯНКА / автобусний тур 
        зі Львова.`,
        createdAt: new Date(),
      },
    ], {});

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};