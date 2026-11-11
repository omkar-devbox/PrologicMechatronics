export type PageRoute = 
  | 'home' 
  | 'products' 
  | 'about-us' 
  | 'careers' 
  | 'news-events'
  | 'contact-us';

export interface PageMeta {
  title: string;
  description: string;
  keywords: string;
}

export interface NavItem {
  id: PageRoute;
  label: string;
  path: string;
  badge?: string;
  meta: PageMeta;
}

// ==========================================
// Solution / Automation Product Types
// ==========================================
export type SolutionCategory = 
  | 'conveyors' 
  | 'monorails' 
  | 'warehousing' 
  | 'lifting' 
  | 'automation-controls';

export interface SolutionItem {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;
  category: SolutionCategory;
  thumbnail: string;
  description: string;
  features: string[];
  applications: string[];
  specs?: Record<string, string>;
}

// ==========================================
// Industry We Serve Types
// ==========================================
export interface IndustrySector {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  badge: string;
  image: string;
  description: string;
  tags: string[];
  capabilities: string[];
}

// ==========================================
// Featured Project / Case Study Types
// ==========================================
export interface ProjectCaseStudy {
  id: string;
  title: string;
  clientIndustry: string;
  application: string;
  scope: string;
  controls: string;
  result: string;
  keyMetric: string;
  image: string;
  gallery?: string[];
}

// ==========================================
// News & Events Types
// ==========================================
export type NewsEventType = 'event' | 'news' | 'innovation' | 'award';

export interface NewsEventItem {
  id: string;
  type: NewsEventType;
  badge: string;
  tag: string;
  title: string;
  date?: string;
  location?: string;
  description: string;
  image: string;
  linkText?: string;
  linkUrl?: string;
}

// ==========================================
// Client & Testimonial Types
// ==========================================
export interface ClientLogo {
  id: string;
  name: string;
  logo: string;
  category?: 'oem' | 'tier1' | 'industrial';
}

export interface ClientTestimonial {
  id: string;
  clientName: string;
  role: string;
  company: string;
  location: string;
  rating: number;
  content: string;
  avatar?: string;
}

// ==========================================
// Inquiry & Contact Form Types
// ==========================================
export interface QuoteRequestForm {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  solutionRequired: string;
  industrySector: string;
  projectScope: string;
}

