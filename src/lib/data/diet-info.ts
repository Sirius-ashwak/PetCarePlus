
export interface DietInfoCategory {
  title: string;
  description?: string;
  items: string[];
}

export interface PetDietInfo {
  petType: 'Dog' | 'Cat';
  commonAllergens: DietInfoCategory;
  safeFoods: DietInfoCategory;
  unsafeFoods: DietInfoCategory;
  generalDietTips: string[];
}

export const dietDatabase: PetDietInfo[] = [
  {
    petType: 'Dog',
    commonAllergens: {
      title: 'Common Allergens for Dogs',
      description: 'These are some common ingredients that can cause allergic reactions in dogs. Symptoms can include itching, skin rashes, vomiting, or diarrhea.',
      items: [
        'Beef',
        'Dairy products',
        'Chicken',
        'Wheat',
        'Soy',
        'Corn',
        'Eggs',
        'Lamb',
        'Fish (certain types)',
        'Artificial additives (colors, preservatives)',
      ],
    },
    safeFoods: {
      title: 'Safe Foods for Dogs (in moderation)',
      description: 'These foods are generally safe for dogs in small quantities. Always introduce new foods slowly.',
      items: [
        'Cooked lean meats (chicken, turkey, beef - no bones, no skin, unseasoned)',
        'Cooked fish (salmon, tuna - boneless, unseasoned)',
        'Cooked eggs',
        'Plain yogurt (no artificial sweeteners)',
        'Cottage cheese',
        'Carrots (raw or cooked)',
        'Green beans (cooked or raw)',
        'Sweet potatoes (cooked, plain)',
        'Pumpkin (plain, cooked - good for digestion)',
        'Apples (no seeds or core)',
        'Bananas',
        'Blueberries',
        'Watermelon (seedless)',
        'Peanut butter (xylitol-free ONLY)',
        'Rice (plain, cooked white or brown)',
        'Oatmeal (plain, cooked)',
      ],
    },
    unsafeFoods: {
      title: 'Unsafe & Toxic Foods for Dogs',
      description: 'These foods are dangerous and potentially toxic to dogs. AVOID feeding these to your dog.',
      items: [
        'Chocolate (especially dark chocolate)',
        'Xylitol (artificial sweetener found in gum, candy, some peanut butters)',
        'Grapes and Raisins',
        'Onions and Garlic (and related plants like chives)',
        'Alcohol',
        'Caffeine (coffee, tea, soda)',
        'Macadamia nuts',
        'Avocado (contains persin)',
        'Cooked bones (can splinter)',
        'Fatty foods and trimmings (can cause pancreatitis)',
        'Yeast dough (raw)',
        'Fruit pits and seeds (e.g., apple seeds, cherry pits - contain cyanide)',
        'Mushrooms (certain wild varieties)',
        'Dairy (many dogs are lactose intolerant)',
        'Salty foods in excess',
      ],
    },
    generalDietTips: [
        "Always provide fresh, clean water.",
        "Choose a high-quality commercial dog food appropriate for your dog's age, breed, and activity level.",
        "Avoid sudden changes in diet to prevent digestive upset.",
        "Treats should not make up more than 10% of your dog's daily caloric intake.",
        "Consult your veterinarian for specific dietary recommendations, especially if your dog has health issues."
    ]
  },
  {
    petType: 'Cat',
    commonAllergens: {
      title: 'Common Allergens for Cats',
      description: 'Cats can also suffer from food allergies. Watch for signs like excessive grooming, skin irritation, or digestive problems.',
      items: [
        'Beef',
        'Fish (certain types, surprisingly common)',
        'Chicken',
        'Dairy products (most cats are lactose intolerant)',
        'Eggs',
        'Corn',
        'Wheat gluten',
        'Soy',
        'Lamb',
        'Artificial additives',
      ],
    },
    safeFoods: {
      title: 'Safe Foods for Cats (in small amounts as treats)',
      description: 'Cats are obligate carnivores, so their diet should primarily consist of meat. These are occasional treats.',
      items: [
        'Cooked lean meat (chicken, turkey - plain, boneless, skinless)',
        'Cooked fish (salmon, tuna - in moderation due to mercury risk, plain, boneless)',
        'Cooked eggs (scrambled or boiled, plain)',
        'Small amounts of plain, cooked rice or oatmeal',
        'Tiny pieces of certain vegetables (e.g., cooked carrots, green beans, pumpkin - some cats enjoy them)',
        'Commercial cat treats specifically formulated for felines',
      ],
    },
    unsafeFoods: {
      title: 'Unsafe & Toxic Foods for Cats',
      description: 'These foods are harmful to cats and should be strictly avoided.',
      items: [
        'Onions and Garlic (and related plants)',
        'Chocolate',
        'Alcohol',
        'Caffeine',
        'Grapes and Raisins',
        'Xylitol',
        'Dog food (lacks specific nutrients cats need, like taurine)',
        'Raw meat, fish, or eggs (risk of bacteria like Salmonella, E. coli)',
        'Cooked bones (can splinter and cause internal damage)',
        'Dairy products (milk, cheese - most cats are lactose intolerant)',
        'Tuna (canned for humans - in excess can lead to mercury poisoning and malnutrition)',
        'Fat trimmings (can cause pancreatitis)',
        'Yeast dough (raw)',
        'Mushrooms (certain wild varieties)',
        'Lilies (highly toxic to cats, including pollen)',
      ],
    },
    generalDietTips: [
        "Ensure constant access to fresh, clean water. Some cats prefer running water (fountains).",
        "Feed a high-quality commercial cat food (wet or dry, or a mix) formulated for their life stage.",
        "Cats are obligate carnivores; their diet must be rich in animal protein.",
        "Taurine is an essential amino acid for cats; ensure their food provides it.",
        "Avoid free-feeding unless recommended by your vet, as it can lead to obesity.",
        "Consult your veterinarian for personalized diet advice."
    ]
  },
];
