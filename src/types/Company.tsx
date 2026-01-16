export interface Company {
  enabled: boolean
  companyName: string;
  payRate: number;
  color: string;
  portalConfig: {
    portalLink: string;
    selector: string;
    rounding: boolean;
    validCallDuration: number;
    websiteTitleTimer: boolean;
    keywords: {
      available: string[];
      onCall: string[];
      acw: string[];
      unavailable: string[];
      ringing: string[];
    };
  };
}