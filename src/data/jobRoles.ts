export type SkillLevel = "Skilled" | "Semi-Skilled" | "Unskilled";

export interface JobRole {
  title: string;
  level: SkillLevel;
  category: string;
  emoji: string;
  duties: string[];
  iti?: boolean;
}

export const jobRoles: JobRole[] = [
  { title: "Electrician", level: "Skilled", category: "Electrical", emoji: "⚡", iti: true, duties: ["Panel board wiring", "Industrial electrical maintenance"] },
  { title: "Panel Board Wireman", level: "Skilled", category: "Electrical", emoji: "🔌", iti: true, duties: ["Control panel wiring", "Testing & fault finding"] },
  { title: "Fiber Optic Splicer", level: "Skilled", category: "Fiber", emoji: "🌐", duties: ["Fiber splicing", "Network setup & support"] },
  { title: "Plumber", level: "Skilled", category: "Plumbing", emoji: "🔧", duties: ["Pipe fitting", "Water line installation & repair"] },
  { title: "Fitter", level: "Skilled", category: "ITI Trades", emoji: "⚙️", iti: true, duties: ["Machine fitting", "Plant maintenance"] },
  { title: "Turner", level: "Skilled", category: "ITI Trades", emoji: "🛠️", iti: true, duties: ["Lathe operation", "Precision turning"] },
  { title: "Welder", level: "Skilled", category: "ITI Trades", emoji: "🔥", iti: true, duties: ["Arc / MIG / TIG welding", "Fabrication work"] },
  { title: "Machinist", level: "Skilled", category: "ITI Trades", emoji: "🏭", iti: true, duties: ["CNC / conventional machines", "Reading drawings"] },
  { title: "Machine Operator", level: "Skilled", category: "Production", emoji: "🎛️", duties: ["Run production machines", "Shift-wise output"] },
  { title: "Supervisor", level: "Skilled", category: "Production", emoji: "📋", duties: ["Lead a team of workers", "Attendance & safety"] },
  { title: "Cable Installation Helper", level: "Semi-Skilled", category: "Fiber", emoji: "🧵", duties: ["Cable laying & pulling", "Assist technicians"] },
  { title: "Pipe Fitting Helper", level: "Semi-Skilled", category: "Plumbing", emoji: "🔩", duties: ["Assist plumbers", "Material handling"] },
  { title: "Machine Helper", level: "Semi-Skilled", category: "Production", emoji: "🧰", duties: ["Assist operators", "Basic machine care"] },
  { title: "Quality & Packaging Inspector", level: "Semi-Skilled", category: "Quality", emoji: "✅", duties: ["Check products", "Packaging inspection"] },
  { title: "General Helper", level: "Unskilled", category: "Labour", emoji: "👷", duties: ["Factory support work", "No experience needed"] },
  { title: "Loading / Unloading Worker", level: "Unskilled", category: "Labour", emoji: "📦", duties: ["Load & unload trucks", "Stacking material"] },
  { title: "Material Handler", level: "Unskilled", category: "Labour", emoji: "🚚", duties: ["Move material in plant", "Dispatch support"] },
  { title: "Industrial Housekeeping Staff", level: "Unskilled", category: "Housekeeping", emoji: "🧹", duties: ["Plant floor upkeep", "Warehouse housekeeping"] },
];
