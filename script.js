const menuItems = [
    {
        name: "FILTER COFFEE",
        description: "",
        price: "150 TL",
        category: "coffee",
        image: "filter.png"
    },
    {
        name: "TUBORG 50CL (DRAFT)",
        description: "",
        price: "180 TL",
        category: "beers",
        image: "beer.png"
    },
    {
        name: "TUBORG 30CL (DRAFT)",
        description: "",
        price: "165 TL",
        category: "beers",
        image: "beer.png"
    },
    {
        name: "PICKLE BEER 30CL",
        description: "",
        price: "180 TL",
        category: "beers",
        image: "beer.png"
    },

    {
        name: "PICKLE BEER",
        description: "If you're a fan of both pickles and beer, you absolutely must try the combination of the two!",
        price: "200 TL",
        category: "beers",
        image: "beer.png"
    },
    {
        name: "HELLBOY",
        description: "!",
        price: "280 TL",
        category: "beers",
        image: "hellboy.png"
    },
    {
        name: "PICKLE WITH TEQUILA",
        description: "If you love tequila, pickles and beer, you absolutely gonna like this",
        price: "220 TL",
        category: "beers",
        image: "beersalt.png"
    },
    {
        name: "MEXICAN BEER",
        description: "Combine of cold beer and freshly squeezed lemon juice",
        price: "200 TL",
        category: "beers",
        image: "beersalt.png"
    },
    {
        name: "MEXICAN WITH TEQUILA",
        description: "Cold beer, tequila and freshly squeezed lemon juice",
        price: "220 TL",
        category: "beers",
        image: "beersalt.png"
    },
    {
        name: "BOTTLE BEER",
        description: "",
        price: "200 TL",
        category: "beers",
        image: "tuborgbottle.png"
    },
    {
        name: "HEINEKEN 30CL",
        description: "",
        price: "180 TL",
        category: "beers",
        image: "heineken.png"
    },
    {
        name: "HEINEKEN 50CL",
        description: "",
        price: "210 TL",
        category: "beers",
        image: "heinekenteneke.png"
    },
    {
        name: "CORONA BOTTLE BEER",
        description: "Corona 50Cl bottle beer with lime",
        price: "240 TL",
        category: "beers",
        image: "corona.png"
    },
    {
        name: "GUINNESS BOTTLE BEER",
        description: "The world-famous Irish dry stout, known for its dark, rich color and velvety smooth texture. A true classic!",
        price: "240 TL",
        category: "beers",
        image: "guiness.png"
    },
    {
        name: "AMSTERDAM BOTTLE BEER",
        description: "A refreshing and crisp lager inspired by the vibrant spirit of Amsterdam. Cheers to good times.",
        price: "240 TL",
        category: "beers",
        image: "amsterdam.png"
    },
    {
        name: "TEQUILA",
        description: "If life gives you lemon and salt ask for tequila",
        price: "85 TL",
        category: "shots",
        image: "tequila.png"
    },
    {
        name: "JAGERMEISTER",
        description: "A classic German liqueur, known for its rich, fruity flavor and smooth texture.",
        price: "120 TL",
        category: "shots",
        image: "jager.png"
    },
    {
        name: "BLACK LABEL SHOT",
        description: "",
        price: "125 TL",
        category: "shots",
        image: "blacklabel.png"
    },
    {
        name: "JACK DANIELS SHOT",
        description: "",
        price: "120 TL",
        category: "shots",
        image: "jackshot.png"
    },
    {
        name: "BAILEYS SHOT",
        description: "",
        price: "100 TL",
        category: "shots",
        image: "baileys.png"
    },
    {
        name: "ZIVANIA",
        description: "",
        price: "100 TL",
        category: "shots",
        image: "zivania.png"
    },
    {
        name: "5 SHOTS MIX",
        description: "Your choice of any 5 shots from our selection",
        price: "500 TL",
        category: "shots",
        image: "5shot.png"
    },
    {
        name: "CHIVAS 12",
        description: "",
        price: "300 TL",
        category: "whiskeys",
        image: "chivas.png"
    },
    {
        name: "BLACK LABEL",
        description: "",
        price: "300 TL",
        category: "whiskeys",
        image: "blacklabel.png"
    },
    {
        name: "JACK DANIELS",
        description: "",
        price: "300 TL",
        category: "whiskeys",
        image: "jackglass.png"
    },
    {
        name: "JAMESON",
        description: "",
        price: "300 TL",
        category: "whiskeys",
        image: "jameson.png"
    },
    {
        name: "JIM BEAM",
        description: "",
        price: "270 TL",
        category: "whiskeys",
        image: "jimbean.png"
    },
    {
        name: "FIREBALL",
        description: "Cinnamon flavored whiskey with a sweet and spicy kick",
        price: "280 TL",
        category: "whiskeys",
        image: "fireball.png"
    },
    {
        name: "LOCAL WHISKEY",
        description: "",
        price: "240 TL",
        category: "whiskeys",
        image: "wniskey.png"
    },
    {
        name: "BARBIE",
        description: "A vibrant pink cocktail that's as fun as it is delicious",
        price: "300 TL",
        category: "cocktails",
        image: "barbieglass.png"
    },
    {
        name: "JAGGERITO",
        description: "",
        price: "325 TL",
        category: "cocktails",
        image: "jaggerito1.png"
    },
    {
        name: "LONG ISLAND",
        description: "A classic cocktail featuring a potent blend of vodka, rum, gin, tequila, triple sec, and cola. A refreshing and powerful drink!",
        price: "350 TL",
        category: "cocktails",
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=500"
    },
    {
        name: "APEROL SPRITZ",
        description: "Aperol Spritz !has a vibrant orange color and a bittersweet, citrusy flavor profile, making it the perfect drink for warm weather",
        price: "320 TL",
        category: "cocktails",
        image: "aperol.png"
    },
    {
        name: "SUN BATH",
        description: "",
        price: "320 TL",
        category: "cocktails",
        image: "sunbath.png"
    },
    {
        name: "S.O.T.B",
        description: "Sex On The Beach - A fruity cocktail with vodka, peach schnapps, orange juice, and cranberry juice",
        price: "300 TL",
        category: "cocktails",
        image: "sexonthebeach.png"
    },
    {
        name: "Green Gringo",
        description: "Aliens in the town with green blood",
        price: "325 TL",
        category: "cocktails",
        image: "greengo.png"
    },
    {
        name: "PICKLE SPECIAL",
        description: "Our signature cocktail featuring our house-made pickle infusion",
        price: "280 TL",
        category: "cocktails",
        image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500"
    },
    {
        name: "TOKYO ICETEA",
        description: "A Japanese twist on the classic Long Island Ice Tea",
        price: "350 TL",
        category: "cocktails",
        image: "tokyo.png"
    },
    {
        name: "IRONMAN",
        description: "",
        price: "325 TL",
        category: "cocktails",
        image: "ironman.png"
    },
    {
        name: "GIN + SOFT",
        description: "Gin mixed with your choice of soft drink",
        price: "250 TL",
        category: "cocktails",
        image: "ginsoft.png"
    },
    {
        name: "VODKA + SOFT",
        description: "Vodka mixed with your choice of soft drink",
        price: "250 TL",
        category: "cocktails",
        image: "ginsoft.png"
    },
    {
        name: "MARGARITA",
        description: "",
        price: "250 TL",
        category: "cocktails",
        image: "margarita.png"
    },
    {
        name: "JAGERBOMB",
        description: "Jägermeister dropped into an energy drink",
        price: "300 TL",
        category: "cocktails",
        image: "jagerbomb.png"
    },
    {
        name: "BOMBAY + SOFT",
        description: "Premium Bombay Sapphire gin with your choice of soft drink",
        price: "300 TL",
        category: "cocktails",
        image: "bombay.png"
    },
    {
        name: "ABSOLUT + SOFT",
        description: "Premium Absolut vodka with your choice of soft drink",
        price: "300 TL",
        category: "cocktails",
        image: "absolute.png"
    },
    {
        name: "HÖNÖNÖ",
        description: "A unique house specialty cocktail",
        price: "250 TL",
        category: "cocktails",
        image: "honono.png"
    },
    {
        name: "SOUR PATCH",
        description: "A sweet and sour cocktail experience.",
        price: "350 TL",
        category: "cocktails",
        image: "sourpatch.png"
    },
    {
        name: "BEER PLATE",
        description: "Onion rings, french fries, crispy chicken, wings, hellim, tortilla chips",
        price: "550 TL",
        category: "foods",
        image: "beerplate.png"
    },
    {
        name: "FRENCH FRIES",
        description: "Crispy golden french fries",
        price: "250 TL",
        category: "foods",
        image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=500"
    },
    {
        name: "HOT DOGS X2",
        description: "Two delicious hot dogs with all the fixings",
        price: "350 TL",
        category: "foods",
        image: "hotdog.png"
    },
    {
        name: "PICKLE MONSTER BURGER",
        description: "Can’t decide between chicken or beef? With the Pickle Monster, you don’t have to! This beast of a burger comes loaded with crispy chicken, juicy beef, bold pickles, and our signature sauces. It’s not just a meal—it’s a monster that crushes hunger!",
        price: "575 TL",
        category: "foods",
        image: "monster.png"
    },
    {
        name: "CHEESY BEEF BURGER",
        description: "Juicy beef patty with fresh toppings on a toasted bun",
        price: "450 TL",
        category: "foods",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500"
    },
    {
        name: "CHICKEN BURGER",
        description: "Tender chicken patty with fresh toppings on a toasted bun",
        price: "400 TL",
        category: "foods",
        image: "chickenbutger.png"
    },
    {
        name: "TIFTIK BURGER",
        description: "Delicious Tiftik burger with premium ingredients",
        price: "550 TL",
        category: "foods",
        image: "tiftik.png"
    },
    {
        name: "CHICKEN WRAP",
        description: "Grilled chicken with fresh vegetables wrapped in a soft tortilla",
        price: "400 TL",
        category: "foods",
        image: "chicken.png"
    },
    {
        name: "BEEF WRAP",
        description: "Tender beef with fresh vegetables wrapped in a soft tortilla",
        price: "430 TL",
        category: "foods",
        image: "beef2.png"
    },
    {
        name: "PIZZA",
        description: "Tender beef with fresh vegetables wrapped in a soft tortilla",
        price: "550 TL",
        category: "foods",
        image: "pizza1.png"
    },
    {
        name: "MIXED NUTS",
        description: "A selection of premium mixed nuts",
        price: "100 TL",
        category: "sides",
        image: "mixednuts.png"
    },
    {
        name: "PEANUTS",
        description: "Roasted peanuts, perfect for snacking",
        price: "75 TL",
        category: "sides",
        image: "peanuts.png"
    },
    {
        name: "RUFFLES, LAYS",
        description: "Your choice of premium potato chips",
        price: "75 TL",
        category: "sides",
        image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500"
    },
    {
        name: "Lemonade",
        description: "",
        price: "160 TL",
        category: "softdrinks",
        image: "lemonade.png"
    },
    {
        name: "Water",
        description: "",
        price: "40 TL",
        category: "softdrinks",
        image: "water.png"
    },
    {
        name: "Coca-Cola,Fanta,Sprite",
        description: "",
        price: "100 TL",
        category: "softdrinks",
        image: "cocacola.png"
    },
    {
        name: "Churchill",
        description: "",
        price: "120 TL",
        category: "softdrinks",
        image: "churchill.png"
    },
    {
        name: "Soda",
        description: "",
        price: "100 TL",
        category: "softdrinks",
        image: "soda.png"
    },
    {
        name: "Mocktails",
        description: "",
        price: "160 TL",
        category: "softdrinks",
        image: "mocktails.png"
    },
    {
        name: "Tea",
        description: "Black,Green,Herbal Tea",
        price: "70 TL",
        category: "softdrinks",
        image: "tea.png"
    },
    {
        name: "Juices",
        description: "",
        price: "120 TL",
        category: "softdrinks",
        image: "juices.png"
    },
    {
        name: "Italian Soda",
        description: "",
        price: "160 TL",
        category: "softdrinks",
        image: "italiansoda.png"
    },
   
];

// Function to create menu item HTML
function createMenuItem(item) {
    return `
        <div class="menu-item" data-category="${item.category}">
            <img src="${item.image}" alt="${item.name}">
            <div class="menu-item-content">
                <h3 class="menu-item-title">${item.name}</h3>
                <p class="menu-item-description">${item.description}</p>
                <p class="menu-item-price">${item.price}</p>
            </div>
        </div>
    `;
}

// Function to display menu items
function displayMenuItems(category = 'all') {
    const menuContainer = document.getElementById('menuContainer');
    const promotionsSection = document.querySelector('.mb-16'); // The section containing Kampanyalar
    
    // Show or hide promotions section based on category
    if (category === 'all') {
        promotionsSection.style.display = 'block';
    } else {
        promotionsSection.style.display = 'none';
    }
    
    menuContainer.innerHTML = '';
    
    const filteredItems = category === 'all' 
        ? menuItems 
        : menuItems.filter(item => item.category === category);
    
    filteredItems.forEach(item => {
        menuContainer.innerHTML += createMenuItem(item);
    });
}

// Add event listeners to category buttons
document.querySelectorAll('.category-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        // Remove active class from all buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        e.target.classList.add('active');
        
        // Display menu items for selected category
        const category = e.target.dataset.category;
        displayMenuItems(category);
    });
});

// Generate QR code
function generateQRCode() {
    const currentUrl = window.location.href;
    const qrCode = document.getElementById('qrCode');
    
    QRCode.toCanvas(qrCode, currentUrl, function (error) {
        if (error) console.error(error);
    });
}

// Initial display
displayMenuItems();
generateQRCode();
