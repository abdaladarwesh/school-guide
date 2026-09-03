export interface Opportunity {
  id: string;
  title: string;
  institution: string;
  location: string;
  image?: string;
  badge?: string;
  funding_type?: string;
  deadline?: string;
  category?: string;
  about?: string;
  requirements?: any;
}
