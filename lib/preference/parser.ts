export interface ExtractedPref {
  occasions?: string[];
  styles?: string[];
  budget?: { min?: number; max?: number };
  colors?: string[];
  gender?: string;
  categories?: string[];
}

export function extractPreferences(text: string): ExtractedPref {
  const lower = text.toLowerCase();
  
  // Basic Regex parsing for MVP
  const budgetMatch = lower.match(/(\d{3,5})/);
  const budget = budgetMatch ? { max: Number(budgetMatch[1]) } : undefined;
  
  const styles = [] as string[];
  if (lower.includes("minimalist")) styles.push("minimalist");
  if (lower.includes("boho")) styles.push("boho");
  if (lower.includes("casual")) styles.push("casual");
  if (lower.includes("formal")) styles.push("formal");
  
  const occasions = [] as string[];
  if (lower.includes("farewell")) occasions.push("farewell");
  if (lower.includes("wedding")) occasions.push("wedding");
  if (lower.includes("party")) occasions.push("party");
  
  const colors = [] as string[];
  if (lower.includes("black")) colors.push("black");
  if (lower.includes("white")) colors.push("white");
  if (lower.includes("red")) colors.push("red");
  if (lower.includes("blue")) colors.push("blue");
  
  const categories = [] as string[];
  if (lower.match(/\b(pant|pants|trousers|jeans)\b/)) categories.push("pants");
  if (lower.match(/\b(shirt|shirts|tshirt|t-shirt|top|tops)\b/)) categories.push("shirt");
  if (lower.match(/\b(dress|dresses|gown)\b/)) categories.push("dress");
  if (lower.match(/\b(jacket|jackets|coat|blazer)\b/)) categories.push("jacket");
  if (lower.match(/\b(skirt|skirts)\b/)) categories.push("skirt");

  const gender = lower.includes("men") ? "men" : lower.includes("women") ? "women" : undefined;
  
  return { occasions, styles, budget, colors, gender, categories };
}
