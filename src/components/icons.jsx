/**
 * Centralized icon map using Lucide React.
 * Stroke width: 1.5px across all icons.
 * Default size: 20px (override with size prop).
 */
import React from 'react';
import {
  Beef, Milk, Leaf,
  Flame, UtensilsCrossed, CookingPot, Swords,
  Zap, Wind, Microwave, Sandwich,
  Blend, Cpu, Droplets, Waves,
  Salad, Fish, Egg, Apple, Cherry,
  ShoppingBasket, Star, Clock, Users, ChevronLeft,
} from 'lucide-react';

// Assign a stable component to each semantic key
export const ICONS = {
  // Kosher category
  meat:    Beef,
  dairy:   Milk,
  pareve:  Leaf,

  // Kitchen equipment
  oven:     Flame,
  pan:      UtensilsCrossed,
  pot:      CookingPot,
  grill:    Swords,
  press:    Zap,
  slow:     Waves,
  griddle:  UtensilsCrossed,
  wok:      Salad,
  airfryer: Wind,
  microwave: Microwave,
  steamer:  Droplets,
  toaster:  Sandwich,
  mixer:    Zap,
  blender:  Blend,
  processor: Cpu,

  // Misc UI
  fish:     Fish,
  egg:      Egg,
  fruit:    Apple,
  berry:    Cherry,
  basket:   ShoppingBasket,
  star:     Star,
  clock:    Clock,
  servings: Users,
  next:     ChevronLeft,

  // Category icons (Step3)
  cat_roast:   Flame,
  cat_pan:     UtensilsCrossed,
  cat_stew:    CookingPot,
  cat_grill:   Flame,
  cat_asian:   UtensilsCrossed,
  cat_pasta:   UtensilsCrossed,
  cat_pie:     Egg,
  cat_eggs:    Egg,
  cat_bake:    Star,
  cat_salad:   Salad,
  cat_soup:    CookingPot,
  cat_legumes: Leaf,
  cat_dessert: Cherry,
  cat_fish:    Fish,
};

/**
 * <Icon name="oven" size={20} className="..." />
 */
export default function Icon({ name, size = 20, className = '', style = {} }) {
  const Component = ICONS[name];
  if (!Component) return null;
  return (
    <Component
      size={size}
      strokeWidth={1.5}
      className={className}
      style={style}
    />
  );
}
