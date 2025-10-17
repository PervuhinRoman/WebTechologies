const dishes = [
  // СУПЫ (6 шт.)
  {
    keyword: 'gaspacho',
    name: 'Гаспачо',
    price: 195,
    category: 'soup',
    count: '350 г',
    image: 'https://images.unsplash.com/photo-1662469838214-a97415cd83fe?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    kind: 'veg'
  },
  {
    keyword: 'mushroom_soup',
    name: 'Грибной суп-пюре',
    price: 185,
    category: 'soup',
    count: '330 г',
    image: 'https://images.unsplash.com/photo-1560684352-8497838a2229?q=80&w=1056&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    kind: 'veg'
  },
  {
    keyword: 'norwegian_soup',
    name: 'Норвежский суп',
    price: 270,
    category: 'soup',
    count: '330 г',
    image: 'https://images.unsplash.com/photo-1698764927956-3ff2333c1483?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    kind: 'meat'
  },
  {
    keyword: 'ramen',
    name: 'Рамен',
    price: 375,
    category: 'soup',
    count: '425 г',
    image: 'https://images.unsplash.com/photo-1638866281450-3933540af86a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470',
    kind: 'meat'
  },
  {
    keyword: 'tom_yam',
    name: 'Том ям с креветками',
    price: 650,
    category: 'soup',
    count: '500 г',
    image: 'https://images.unsplash.com/photo-1627703737110-4b6c2633cc16?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1469',
    kind: 'fish'
  },
  {
    keyword: 'chicken_soup',
    name: 'Куриный суп',
    price: 330,
    category: 'soup',
    count: '350 г',
    image: 'https://images.unsplash.com/photo-1605461682195-9fd4d079a41d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=928',
    kind: 'meat'
  },

  // ГЛАВНЫЕ БЛЮДА (6 шт.)
  {
    keyword: 'fried_potatoes',
    name: 'Жареная картошка с грибами',
    price: 150,
    category: 'main',
    count: '250 г',
    image: 'https://images.unsplash.com/photo-1633959639799-6d3f66e05710?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    kind: 'veg'
  },
  {
    keyword: 'lasagna',
    name: 'Лазанья',
    price: 385,
    category: 'main',
    count: '310 г',
    image: 'https://images.unsplash.com/photo-1709429790175-b02bb1b19207?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    kind: 'meat'
  },
  {
    keyword: 'chicken_cutlets',
    name: 'Котлеты из курицы с картофельным пюре',
    price: 225,
    category: 'main',
    count: '280 г',
    image: 'https://media.istockphoto.com/id/2217951579/photo/tokyo-katsu-bites-with-chicken-meat-mashed-potato-sauteed-mix-vegetable-strawberry-sauce.webp?a=1&b=1&s=612x612&w=0&k=20&c=ONuA0nXn1_JPe7L1at_IwXpGnkH_F65Rt3MJrUBnabY=',
    kind: 'meat'
  },
  {
    keyword: 'fish_cutlet',
    name: 'Рыбная котлета с рисом и спаржей',
    price: 320,
    category: 'main',
    count: '270 г',
    image: 'https://images.unsplash.com/photo-1715692727499-cd7ba190587c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470',
    kind: 'fish'
  },
  {
    keyword: 'pizza_margherita',
    name: 'Пицца Маргарита',
    price: 450,
    category: 'main',
    count: '470 г',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1469',
    kind: 'veg'
  },
  {
    keyword: 'pasta_shrimp',
    name: 'Паста с креветками',
    price: 340,
    category: 'main',
    count: '280 г',
    image: 'https://images.unsplash.com/photo-1635475556713-8d3ff880d9ba?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=774',
    kind: 'fish'
  },

  // САЛАТЫ И СТАРТЕРЫ (6 шт.)
  {
    keyword: 'korean_salad',
    name: 'Корейский салат с овощами и яйцом',
    price: 330,
    category: 'starter',
    count: '250 г',
    image: 'https://images.unsplash.com/photo-1609501677070-800d6d157367?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=872',
    kind: 'veg'
  },
  {
    keyword: 'caesar_salad',
    name: 'Цезарь с цыплёнком',
    price: 370,
    category: 'starter',
    count: '220 г',
    image: 'https://images.unsplash.com/photo-1580013759032-c96505e24c1f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1209',
    kind: 'meat'
  },
  {
    keyword: 'caprese',
    name: 'Капрезе с моцареллой',
    price: 350,
    category: 'starter',
    count: '235 г',
    image: 'https://images.unsplash.com/photo-1760023570385-ee484f7076b3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=870',
    kind: 'veg'
  },
  {
    keyword: 'tuna_salad',
    name: 'Салат с тунцом',
    price: 480,
    category: 'starter',
    count: '250 г',
    image: 'https://images.unsplash.com/photo-1604909052743-94e838986d24?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1160',
    kind: 'fish'
  },
  {
    keyword: 'fries_caesar',
    name: 'Картофель фри с соусом Цезарь',
    price: 280,
    category: 'starter',
    count: '235 г',
    image: 'https://images.unsplash.com/photo-1733907502022-3ec7de6dc86e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1160',
    kind: 'veg'
  },
  {
    keyword: 'fries_ketchup',
    name: 'Картофель фри с кетчупом',
    price: 260,
    category: 'starter',
    count: '235 г',
    image: 'https://images.unsplash.com/photo-1580559489333-755f7e3c8949?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470',
    kind: 'veg'
  },

  // НАПИТКИ (6 шт.)
  {
    keyword: 'orange_juice',
    name: 'Апельсиновый сок',
    price: 120,
    category: 'drink',
    count: '300 мл',
    image: 'https://images.unsplash.com/photo-1577680716097-9a565ddc2007?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    kind: 'cold'
  },
  {
    keyword: 'apple_juice',
    name: 'Яблочный сок',
    price: 90,
    category: 'drink',
    count: '300 мл',
    image: 'https://images.unsplash.com/photo-1605199910378-edb0c0709ab4?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    kind: 'cold'
  },
  {
    keyword: 'carrot_juice',
    name: 'Морковный сок',
    price: 110,
    category: 'drink',
    count: '300 мл',
    image: 'https://images.unsplash.com/photo-1555940726-1c297abcc1f1?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    kind: 'cold'
  },
  {
    keyword: 'cappuccino',
    name: 'Капучино',
    price: 180,
    category: 'drink',
    count: '300 мл',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1235',
    kind: 'hot'
  },
  {
    keyword: 'green_tea',
    name: 'Зеленый чай',
    price: 100,
    category: 'drink',
    count: '300 мл',
    image: 'https://images.unsplash.com/photo-1524914415733-3eb400768a13?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1471',
    kind: 'hot'
  },
  {
    keyword: 'black_tea',
    name: 'Черный чай',
    price: 90,
    category: 'drink',
    count: '300 мл',
    image: 'https://images.unsplash.com/photo-1628153915053-9a493ee1a27e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1160',
    kind: 'hot'
  },

  // ДЕСЕРТЫ (6 шт.)
  {
    keyword: 'baklava',
    name: 'Пахлава',
    price: 220,
    category: 'dessert',
    count: '300 г',
    image: 'https://images.unsplash.com/photo-1617806501553-d3a6a3a7b227?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470',
    kind: 'small'
  },
  {
    keyword: 'cheesecake',
    name: 'Чизкейк',
    price: 240,
    category: 'dessert',
    count: '125 г',
    image: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1471',
    kind: 'medium'
  },
  {
    keyword: 'chocolate_cheesecake',
    name: 'Шоколадный чизкейк',
    price: 260,
    category: 'dessert',
    count: '125 г',
    image: 'https://images.unsplash.com/photo-1663257130299-aef19587a4bd?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=774',
    kind: 'medium'
  },
  {
    keyword: 'chocolate_cake',
    name: 'Шоколадный торт',
    price: 270,
    category: 'dessert',
    count: '140 г',
    image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1006',
    kind: 'large'
  },
  {
    keyword: 'donuts_3',
    name: 'Пончики (3 штуки)',
    price: 410,
    category: 'dessert',
    count: '350 г',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=928',
    kind: 'medium'
  },
  {
    keyword: 'donuts_6',
    name: 'Пончики (6 штук)',
    price: 650,
    category: 'dessert',
    count: '700 г',
    image: 'https://images.unsplash.com/photo-1514517521153-1be72277b32f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=774',
    kind: 'large'
  }
];