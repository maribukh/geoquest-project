
import React, { useState } from 'react';
import { UserState } from '../types';

interface RecipeBookProps {
  userState: UserState;
  unlockedCount: number;
}

interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  time: string;
  calories: string;
  unlockCondition: string;
  isUnlocked: boolean;
  ingredients: string[];
}

const RecipeBook: React.FC<RecipeBookProps> = ({ userState, unlockedCount }) => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const RECIPES: Recipe[] = [
    {
      id: 'khinkali',
      title: 'Juicy Khinkali',
      description: 'The King of Georgian dumplings. Requires skill to fold exactly 19 pleats!',
      image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=800&auto=format&fit=crop',
      difficulty: 'Hard',
      time: '1.5 hrs',
      calories: '250 kcal/pc',
      unlockCondition: 'Unlocked (Welcome Gift)',
      isUnlocked: true,
      ingredients: ['Flour', 'Minced Beef & Pork', 'Cumin', 'Cilantro', 'Onion', 'Ice Water']
    },
    {
      id: 'imeretian_khachapuri',
      title: 'Classic Imeretian Khachapuri',
      description: 'The most authentic version. Soft, round dough filled with melted Imeretian cheese.',
      image: 'https://images.unsplash.com/photo-1621516598583-0498b5846173?q=80&w=800&auto=format&fit=crop',
      difficulty: 'Medium',
      time: '50 mins',
      calories: '400 kcal',
      unlockCondition: 'Unlocked (Welcome Gift)',
      isUnlocked: true,
      ingredients: ['Flour', 'Yeast', 'Matsoni (Yogurt)', 'Imeretian Cheese', 'Butter', 'Egg']
    },
    {
      id: 'lobio',
      title: 'Lobio in Clay Pot',
      description: 'A rich and spicy bean stew, slowly cooked with fresh herbs and served with cornbread (Mchadi).',
      image: 'https://images.unsplash.com/photo-1543572186-b48592994998?q=80&w=800&auto=format&fit=crop',
      difficulty: 'Easy',
      time: '2 hrs',
      calories: '280 kcal',
      unlockCondition: 'Find 1 Landmark',
      isUnlocked: unlockedCount >= 1,
      ingredients: ['Red Kidney Beans', 'Onions', 'Garlic', 'Cilantro', 'Blue Fenugreek', 'Dried Savory']
    },
    {
      id: 'khachapuri',
      title: 'Adjaruli Khachapuri',
      description: 'The famous cheese boat with an egg yolk sun in the middle.',
      image: 'https://images.unsplash.com/photo-1626505967664-50073286f990?q=80&w=800&auto=format&fit=crop',
      difficulty: 'Medium',
      time: '45 mins',
      calories: 'Too many 😋',
      unlockCondition: 'Find 3 Landmarks',
      isUnlocked: unlockedCount >= 3,
      ingredients: ['Dough', 'Sulguni Cheese', 'Imeretian Cheese', 'Egg Yolk', 'Butter']
    },
    {
      id: 'pkhali',
      title: 'Spinach Pkhali',
      description: 'Healthy and delicious walnut-spinach appetizers styled like colorful balls.',
      image: 'https://georgianjournal.ge/media/images/georgian-news/2018/December/Cuisine/ispanakhis_pkhali.jpg',
      difficulty: 'Easy',
      time: '30 mins',
      calories: '120 kcal',
      unlockCondition: 'Reach Level 2',
      isUnlocked: userState.level >= 2,
      ingredients: ['Spinach', 'Walnuts', 'Garlic', 'Pomegranate Seeds', 'Blue Fenugreek']
    },
    {
      id: 'churchkhela',
      title: 'Churchkhela',
      description: 'The "Georgian Snickers". Walnuts dipped in thick grape juice roux.',
      image: 'https://images.unsplash.com/photo-1603046631405-b772097e3a9c?q=80&w=800&auto=format&fit=crop',
      difficulty: 'Medium',
      time: '1 hr + drying',
      calories: '300 kcal',
      unlockCondition: 'Earn 500 Points',
      isUnlocked: userState.points >= 500,
      ingredients: ['Walnuts (halved)', 'Badagi (Grape Juice)', 'Flour', 'Sunlight']
    }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
         <div>
            <h3 className="text-lg font-black text-slate-800 font-serif">Grandma's Kitchen</h3>
            <p className="text-xs text-slate-500 font-medium">Unlock recipes by exploring the city.</p>
         </div>
         <span className="text-2xl">🥟</span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {RECIPES.map((recipe) => (
            <div 
                key={recipe.id}
                onClick={() => recipe.isUnlocked && setSelectedRecipe(recipe)}
                className={`relative bg-white rounded-3xl p-3 shadow-sm border border-slate-100 overflow-hidden transition-all duration-300 ${recipe.isUnlocked ? 'hover:shadow-lg active:scale-[0.98] cursor-pointer' : 'opacity-80'}`}
            >
                {/* Image Section */}
                <div className="relative h-32 w-full rounded-2xl overflow-hidden mb-3">
                    <img src={recipe.image} alt={recipe.title} className={`w-full h-full object-cover transition-transform duration-700 ${recipe.isUnlocked ? 'hover:scale-110' : 'grayscale blur-[2px]'}`} />
                    
                    {!recipe.isUnlocked && (
                        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white p-4 text-center">
                            <span className="text-2xl mb-1">🔒</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest">Locked</span>
                            <span className="text-xs font-medium mt-1 text-emerald-300">{recipe.unlockCondition}</span>
                        </div>
                    )}

                    {recipe.isUnlocked && (
                         <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-slate-800 shadow-sm">
                            {recipe.time}
                         </div>
                    )}
                </div>

                {/* Info Section */}
                <div className="px-1">
                    <div className="flex justify-between items-start">
                        <h4 className={`font-bold text-base leading-tight ${recipe.isUnlocked ? 'text-slate-800' : 'text-slate-400'}`}>
                            {recipe.title}
                        </h4>
                        {recipe.isUnlocked && (
                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                                recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                recipe.difficulty === 'Medium' ? 'bg-orange-100 text-orange-700' :
                                'bg-red-100 text-red-700'
                            }`}>
                                {recipe.difficulty}
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {recipe.description}
                    </p>
                </div>
            </div>
        ))}
      </div>

      {/* RECIPE MODAL */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-[3000] flex items-end sm:items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-fadeIn" onClick={() => setSelectedRecipe(null)}>
            <div 
                className="bg-[#fdfbf7] w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl relative animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="h-48 relative">
                    <img src={selectedRecipe.image} alt={selectedRecipe.title} className="w-full h-full object-cover" />
                    <button 
                        onClick={() => setSelectedRecipe(null)}
                        className="absolute top-4 right-4 w-10 h-10 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white font-bold hover:bg-black/50 transition-colors"
                    >
                        ✕
                    </button>
                    <div className="absolute -bottom-6 right-6 w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center text-xl shadow-lg border-4 border-[#fdfbf7]">
                        👨‍🍳
                    </div>
                </div>

                <div className="pt-8 px-8 pb-8">
                    <h2 className="text-2xl font-black text-slate-800 font-serif mb-1">{selectedRecipe.title}</h2>
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mb-6">
                        <span>⏱ {selectedRecipe.time}</span>
                        <span>🔥 {selectedRecipe.calories}</span>
                        <span>📊 {selectedRecipe.difficulty}</span>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-xs font-black text-orange-600 uppercase tracking-widest mb-3">Ingredients</h3>
                        <ul className="grid grid-cols-2 gap-2">
                            {selectedRecipe.ingredients.map((ing, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-slate-700 font-medium bg-orange-50 p-2 rounded-xl">
                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                                    {ing}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <button 
                        onClick={() => setSelectedRecipe(null)}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl active:scale-95 transition-transform"
                    >
                        Cook this!
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default RecipeBook;
