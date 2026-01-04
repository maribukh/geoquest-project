import React, { useState } from 'react';
import { UserState } from '../types';

interface RecipeBookProps {
  userState: UserState;
  unlockedCount: number;
}

interface Ingredient {
  name: string;
  amount: string;
  unit: string;
  note?: string;
}

interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  time: string;
  calories: string;
  servings: number;
  unlockCondition: string;
  isUnlocked: boolean;
  ingredients: Ingredient[];
  steps: string[];
  prepTime: string;
  cookTime: string;
}

const RecipeBook: React.FC<RecipeBookProps> = ({
  userState,
  unlockedCount,
}) => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const RECIPES: Recipe[] = [
    {
      id: 'khinkali',
      title: 'Juicy Khinkali',
      description:
        'The King of Georgian dumplings. Requires skill to fold exactly 19 pleats!',
      image:
        'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=800&auto=format&fit=crop',
      difficulty: 'Hard',
      time: '1.5 hrs',
      prepTime: '40 min',
      cookTime: '20 min',
      calories: '250 kcal/pc',
      servings: 4,
      unlockCondition: 'Unlocked (Welcome Gift)',
      isUnlocked: true,
      ingredients: [
        {
          name: 'Flour',
          amount: '500',
          unit: 'g',
          note: 'Type 00 or all-purpose',
        },
        { name: 'Warm water', amount: '200', unit: 'ml', note: '35-40°C' },
        { name: 'Egg', amount: '1', unit: 'pc', note: 'room temperature' },
        { name: 'Salt', amount: '1', unit: 'tsp', note: 'for dough' },
        { name: 'Minced beef', amount: '400', unit: 'g', note: '20% fat' },
        { name: 'Minced pork', amount: '200', unit: 'g' },
        { name: 'Onion', amount: '2', unit: 'medium', note: 'finely chopped' },
        { name: 'Cilantro', amount: '30', unit: 'g', note: 'fresh, chopped' },
        {
          name: 'Black pepper',
          amount: '1',
          unit: 'tsp',
          note: 'freshly ground',
        },
        { name: 'Cumin', amount: '0.5', unit: 'tsp' },
        { name: 'Ice water', amount: '100', unit: 'ml', note: 'for filling' },
      ],
      steps: [
        'Mix flour, egg, warm water and salt to form elastic dough. Rest 30 min.',
        'Combine meats with chopped onion, herbs and spices.',
        'Gradually add ice water to filling, mixing until absorbed.',
        'Roll dough to 2mm thickness, cut 10cm circles.',
        'Place 1 tbsp filling in center, fold edges creating 19 pleats.',
        'Steam for 15-18 minutes, serve hot with black pepper.',
      ],
    },
    {
      id: 'imeretian_khachapuri',
      title: 'Classic Imeretian Khachapuri',
      description: 'Soft, round dough filled with melted Imeretian cheese.',
      image:
        'https://images.unsplash.com/photo-1621516598583-0498b5846173?q=80&w=800&auto=format&fit=crop',
      difficulty: 'Medium',
      time: '50 mins',
      prepTime: '25 min',
      cookTime: '25 min',
      calories: '400 kcal',
      servings: 6,
      unlockCondition: 'Unlocked (Welcome Gift)',
      isUnlocked: true,
      ingredients: [
        { name: 'Flour', amount: '600', unit: 'g' },
        { name: 'Dry yeast', amount: '7', unit: 'g' },
        { name: 'Sugar', amount: '1', unit: 'tbsp' },
        { name: 'Salt', amount: '1', unit: 'tsp' },
        {
          name: 'Matsoni (yogurt)',
          amount: '250',
          unit: 'g',
          note: 'or Greek yogurt',
        },
        { name: 'Warm water', amount: '200', unit: 'ml' },
        { name: 'Butter', amount: '50', unit: 'g', note: 'melted' },
        { name: 'Imeretian cheese', amount: '800', unit: 'g', note: 'grated' },
        {
          name: 'Sulguni cheese',
          amount: '200',
          unit: 'g',
          note: 'optional, for extra flavor',
        },
        { name: 'Egg', amount: '1', unit: 'pc', note: 'for egg wash' },
      ],
      steps: [
        'Activate yeast in warm water with sugar for 10 min.',
        'Mix flour, salt, yogurt, melted butter and yeast mixture.',
        'Knead 10 min until smooth. Let rise 1.5 hours.',
        'Mix cheeses. Divide dough in 2 parts.',
        'Roll each piece, add cheese filling, seal edges.',
        'Flatten gently, brush with egg wash.',
        'Bake at 220°C for 20-25 min until golden.',
      ],
    },
    {
      id: 'lobio',
      title: 'Lobio in Clay Pot',
      description:
        'A rich and spicy bean stew, served with cornbread (Mchadi).',
      image:
        'https://images.unsplash.com/photo-1543572186-b48592994998?q=80&w=800&auto=format&fit=crop',
      difficulty: 'Easy',
      time: '2 hrs',
      prepTime: '20 min',
      cookTime: '1.5 hrs',
      calories: '280 kcal',
      servings: 6,
      unlockCondition: 'Find 1 Landmark',
      isUnlocked: unlockedCount >= 1,
      ingredients: [
        {
          name: 'Red kidney beans',
          amount: '500',
          unit: 'g',
          note: 'soaked overnight',
        },
        { name: 'Onion', amount: '2', unit: 'large', note: 'finely chopped' },
        { name: 'Garlic', amount: '6', unit: 'cloves', note: 'minced' },
        { name: 'Walnuts', amount: '100', unit: 'g', note: 'ground' },
        { name: 'Cilantro', amount: '1', unit: 'bunch', note: 'chopped' },
        { name: 'Blue fenugreek', amount: '1', unit: 'tbsp', note: 'ground' },
        { name: 'Dried savory', amount: '1', unit: 'tsp' },
        { name: 'Red wine vinegar', amount: '2', unit: 'tbsp' },
        { name: 'Vegetable oil', amount: '3', unit: 'tbsp' },
        { name: 'Water', amount: '1.5', unit: 'l' },
        { name: 'Salt', amount: '1.5', unit: 'tsp' },
        { name: 'Black pepper', amount: '1', unit: 'tsp' },
      ],
      steps: [
        'Boil soaked beans in fresh water until tender (about 1 hour).',
        'Sauté onions in oil until golden, add garlic.',
        'Add ground walnuts and spices, cook 2 min.',
        'Combine with beans, add water, simmer 30 min.',
        'Mash some beans to thicken the stew.',
        'Add vinegar, cilantro, adjust seasoning.',
        'Serve in clay pots with mchadi.',
      ],
    },
    {
      id: 'khachapuri',
      title: 'Adjaruli Khachapuri',
      description: 'The famous cheese boat with an egg yolk sun in the middle.',
      image:
        'https://images.unsplash.com/photo-1626505967664-50073286f990?q=80&w=800&auto=format&fit=crop',
      difficulty: 'Medium',
      time: '45 mins',
      prepTime: '25 min',
      cookTime: '20 min',
      calories: '650 kcal',
      servings: 2,
      unlockCondition: 'Find 3 Landmarks',
      isUnlocked: unlockedCount >= 3,
      ingredients: [
        { name: 'Flour', amount: '400', unit: 'g' },
        { name: 'Dry yeast', amount: '5', unit: 'g' },
        { name: 'Sugar', amount: '1', unit: 'tsp' },
        { name: 'Salt', amount: '1', unit: 'tsp' },
        { name: 'Warm milk', amount: '250', unit: 'ml' },
        { name: 'Butter', amount: '30', unit: 'g', note: 'softened' },
        { name: 'Sulguni cheese', amount: '400', unit: 'g', note: 'grated' },
        { name: 'Imeretian cheese', amount: '200', unit: 'g', note: 'grated' },
        { name: 'Egg yolks', amount: '2', unit: 'pc' },
        { name: 'Butter', amount: '50', unit: 'g', note: 'for serving' },
      ],
      steps: [
        'Make dough with flour, yeast, sugar, salt, milk and butter.',
        'Let rise 1 hour until doubled.',
        'Mix cheeses. Divide dough in two.',
        'Roll each into oval, twist ends to form boat shape.',
        'Fill with cheese mixture, leaving center hollow.',
        'Bake at 220°C for 15 min.',
        'Make indentation in center, add egg yolk.',
        'Bake 3 min more. Add butter before serving.',
      ],
    },
    {
      id: 'pkhali',
      title: 'Spinach Pkhali',
      description:
        'Healthy walnut-spinach appetizers styled like colorful balls.',
      image:
        'https://georgianjournal.ge/media/images/georgian-news/2018/December/Cuisine/ispanakhis_pkhali.jpg',
      difficulty: 'Easy',
      time: '30 mins',
      prepTime: '20 min',
      cookTime: '10 min',
      calories: '120 kcal',
      servings: 8,
      unlockCondition: 'Reach Level 2',
      isUnlocked: userState.level >= 2,
      ingredients: [
        { name: 'Fresh spinach', amount: '600', unit: 'g', note: 'washed' },
        { name: 'Walnuts', amount: '200', unit: 'g' },
        { name: 'Onion', amount: '1', unit: 'small' },
        { name: 'Garlic', amount: '3', unit: 'cloves' },
        { name: 'Cilantro', amount: '50', unit: 'g' },
        { name: 'White wine vinegar', amount: '2', unit: 'tbsp' },
        { name: 'Blue fenugreek', amount: '1', unit: 'tsp' },
        {
          name: 'Coriander seeds',
          amount: '0.5',
          unit: 'tsp',
          note: 'ground',
        },
        {
          name: 'Pomegranate seeds',
          amount: '50',
          unit: 'g',
          note: 'for garnish',
        },
        { name: 'Salt', amount: '1', unit: 'tsp' },
        { name: 'Black pepper', amount: '0.5', unit: 'tsp' },
      ],
      steps: [
        'Blanch spinach in boiling water for 2 min, drain well.',
        'Grind walnuts in food processor until fine.',
        'Add onion, garlic, herbs, spices, vinegar.',
        'Squeeze excess water from spinach, add to mixture.',
        'Process until smooth paste forms.',
        'Refrigerate 30 min for flavors to meld.',
        'Form into small balls, flatten slightly.',
        'Garnish with pomegranate seeds.',
      ],
    },
    {
      id: 'churchkhela',
      title: 'Churchkhela',
      description:
        'The "Georgian Snickers". Walnuts dipped in thick grape juice roux.',
      image:
        'https://images.unsplash.com/photo-1603046631405-b772097e3a9c?q=80&w=800&auto=format&fit=crop',
      difficulty: 'Medium',
      time: '1 hr + drying',
      prepTime: '30 min',
      cookTime: '30 min',
      calories: '300 kcal',
      servings: 10,
      unlockCondition: 'Earn 500 Points',
      isUnlocked: userState.points >= 500,
      ingredients: [
        { name: 'Walnut halves', amount: '200', unit: 'g' },
        {
          name: 'Grape juice',
          amount: '1',
          unit: 'l',
          note: 'pure, unsweetened',
        },
        { name: 'Flour', amount: '100', unit: 'g', note: 'wheat' },
        { name: 'Sugar', amount: '200', unit: 'g' },
        {
          name: 'String',
          amount: '1',
          unit: 'm',
          note: 'cotton, for threading',
        },
        { name: 'Needle', amount: '1', unit: 'pc', note: 'large eye' },
      ],
      steps: [
        'Thread walnuts onto string (20-25 cm strands).',
        'Mix flour with 200ml grape juice to make smooth paste.',
        'Heat remaining juice with sugar until sugar dissolves.',
        'Whisk in flour paste, cook on low heat until thick (20 min).',
        'Dip walnut strands into thickened juice, coating evenly.',
        'Hang to dry for 3-5 days in well-ventilated area.',
        'Coat 2-3 more times as it dries for thicker shell.',
        'Store in cool, dry place for up to 6 months.',
      ],
    },
  ];

  const filteredRecipes =
    activeFilter === 'all'
      ? RECIPES
      : RECIPES.filter(
          (recipe) => recipe.difficulty.toLowerCase() === activeFilter
        );

  return (
    <div className='mb-8'>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h3 className='text-2xl font-bold bg-gradient-to-r from-amber-700 to-amber-500 bg-clip-text text-transparent'>
            Grandma's Kitchen
          </h3>
          <p className='text-sm text-slate-600'>
            Unlock recipes by exploring the city
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <div className='px-3 py-1.5 bg-amber-50 rounded-full text-sm font-medium'>
            <span className='text-amber-700'>
              {RECIPES.filter((r) => r.isUnlocked).length}
            </span>
            <span className='text-slate-500'>/{RECIPES.length} unlocked</span>
          </div>
          <span className='text-3xl'>🍽️</span>
        </div>
      </div>

      <div className='flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar'>
        {['all', 'easy', 'medium', 'hard'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeFilter === filter
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {filter === 'all'
              ? 'All Recipes'
              : filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr'>
        {filteredRecipes.map((recipe) => (
          <div
            key={recipe.id}
            onClick={() => recipe.isUnlocked && setSelectedRecipe(recipe)}
            className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 ${
              recipe.isUnlocked
                ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer border-slate-200'
                : 'opacity-60 border-slate-100'
            }`}
          >
            <div className='aspect-[4/3] relative overflow-hidden'>
              <img
                src={recipe.image}
                alt={recipe.title}
                className={`w-full h-full object-cover transition-transform duration-700 ${
                  recipe.isUnlocked ? 'group-hover:scale-110' : 'grayscale'
                }`}
              />
              <div className='absolute top-3 right-3'>
                <span
                  className={`px-2 py-1 rounded-lg text-xs font-bold ${
                    recipe.difficulty === 'Easy'
                      ? 'bg-emerald-500 text-white'
                      : recipe.difficulty === 'Medium'
                      ? 'bg-amber-500 text-white'
                      : 'bg-rose-500 text-white'
                  }`}
                >
                  {recipe.difficulty}
                </span>
              </div>
              {!recipe.isUnlocked && (
                <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col items-center justify-center'>
                  <div className='w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2'>
                    <span className='text-2xl'>🔒</span>
                  </div>
                  <span className='text-sm font-bold text-white'>
                    {recipe.unlockCondition}
                  </span>
                </div>
              )}
            </div>

            <div className='p-4 bg-white'>
              <div className='flex justify-between items-start mb-2'>
                <h4 className='font-bold text-slate-800 text-lg leading-tight'>
                  {recipe.title}
                </h4>
                <div className='text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded'>
                  {recipe.servings} servings
                </div>
              </div>
              <p className='text-slate-600 text-sm mb-3 line-clamp-2'>
                {recipe.description}
              </p>

              <div className='flex items-center justify-between text-sm'>
                <div className='flex items-center gap-4 text-slate-500'>
                  <span className='flex items-center gap-1'>
                    ⏱ {recipe.time}
                  </span>
                  <span className='flex items-center gap-1'>
                    🔥 {recipe.calories}
                  </span>
                </div>
                {recipe.isUnlocked && (
                  <span className='text-amber-600 font-medium'>View →</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedRecipe && (
        <div className='fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn'>
          <div className='relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto animate-slide-up'>
            <button
              onClick={() => setSelectedRecipe(null)}
              className='absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-700 hover:bg-white transition-colors shadow-lg'
            >
              ✕
            </button>

            <div className='aspect-[16/9] relative overflow-hidden'>
              <img
                src={selectedRecipe.image}
                alt={selectedRecipe.title}
                className='w-full h-full object-cover'
              />
              <div className='absolute bottom-4 left-4 flex gap-2'>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold ${
                    selectedRecipe.difficulty === 'Easy'
                      ? 'bg-emerald-500 text-white'
                      : selectedRecipe.difficulty === 'Medium'
                      ? 'bg-amber-500 text-white'
                      : 'bg-rose-500 text-white'
                  }`}
                >
                  {selectedRecipe.difficulty}
                </span>
                <span className='px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-sm font-bold text-slate-700'>
                  🍽️ {selectedRecipe.servings} servings
                </span>
              </div>
            </div>

            <div className='p-8'>
              <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-6'>
                <div>
                  <h2 className='text-3xl font-bold text-slate-900 mb-2 font-serif'>
                    {selectedRecipe.title}
                  </h2>
                  <p className='text-slate-600'>{selectedRecipe.description}</p>
                </div>
                <div className='mt-4 sm:mt-0 flex items-center gap-6 text-slate-700'>
                  <div className='text-center'>
                    <div className='text-2xl'>⏱</div>
                    <div className='text-sm font-medium'>
                      {selectedRecipe.time}
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='text-2xl'>🔥</div>
                    <div className='text-sm font-medium'>
                      {selectedRecipe.calories}
                    </div>
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-8'>
                <div className='md:col-span-2'>
                  <h3 className='text-xl font-bold text-slate-900 mb-4'>
                    Ingredients
                  </h3>
                  <div className='space-y-2'>
                    {selectedRecipe.ingredients.map((ingredient, index) => (
                      <div
                        key={index}
                        className='flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-100'
                      >
                        <div className='flex items-center gap-3'>
                          <div className='w-2 h-2 rounded-full bg-amber-500'></div>
                          <span className='font-medium text-slate-800'>
                            {ingredient.name}
                          </span>
                          {ingredient.note && (
                            <span className='text-xs text-slate-500'>
                              ({ingredient.note})
                            </span>
                          )}
                        </div>
                        <div className='font-bold text-slate-900'>
                          {ingredient.amount} {ingredient.unit}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className='text-xl font-bold text-slate-900 mb-4'>
                    Time
                  </h3>
                  <div className='space-y-4'>
                    <div className='p-4 rounded-xl bg-slate-50'>
                      <div className='text-sm text-slate-600 mb-1'>
                        Prep Time
                      </div>
                      <div className='text-lg font-bold text-slate-900'>
                        {selectedRecipe.prepTime}
                      </div>
                    </div>
                    <div className='p-4 rounded-xl bg-slate-50'>
                      <div className='text-sm text-slate-600 mb-1'>
                        Cook Time
                      </div>
                      <div className='text-lg font-bold text-slate-900'>
                        {selectedRecipe.cookTime}
                      </div>
                    </div>
                    <div className='p-4 rounded-xl bg-amber-50'>
                      <div className='text-sm text-slate-600 mb-1'>
                        Total Time
                      </div>
                      <div className='text-lg font-bold text-amber-700'>
                        {selectedRecipe.time}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='mb-8'>
                <h3 className='text-xl font-bold text-slate-900 mb-4'>Steps</h3>
                <div className='space-y-4'>
                  {selectedRecipe.steps.map((step, index) => (
                    <div
                      key={index}
                      className='flex gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors'
                    >
                      <div className='flex-shrink-0 w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold'>
                        {index + 1}
                      </div>
                      <p className='text-slate-700 leading-relaxed font-medium'>
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className='flex gap-4'>
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className='flex-1 py-4 px-6 bg-amber-500 text-white rounded-xl font-bold text-lg hover:bg-amber-600 active:scale-95 transition-all shadow-lg shadow-amber-500/20'
                >
                  🍳 Start Cooking
                </button>
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className='py-4 px-6 border-2 border-amber-200 text-amber-700 rounded-xl font-bold hover:bg-amber-50 active:scale-95 transition-all'
                >
                  💾 Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeBook;
