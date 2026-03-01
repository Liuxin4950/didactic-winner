import { createContext, useContext, useState, ReactNode } from 'react';

export interface VisionParams {
  sphere: number;      // 球镜度数 (-10.00 ~ +10.00)
  cylinder: number;     // 柱镜度数/散光 (0 ~ -6.00)
  axis: number;         // 轴向 (0 ~ 180)
}

export interface VisionContextType {
  params: VisionParams;
  setParams: (params: VisionParams) => void;
  viewMode: 'anatomy' | 'simulation';
  setViewMode: (mode: 'anatomy' | 'simulation') => void;
}

const defaultParams: VisionParams = {
  sphere: -3.0,
  cylinder: -1.0,
  axis: 90,
};

const VisionContext = createContext<VisionContextType | undefined>(undefined);

export function VisionProvider({ children }: { children: ReactNode }) {
  const [params, setParams] = useState<VisionParams>(defaultParams);
  const [viewMode, setViewMode] = useState<'anatomy' | 'simulation'>('anatomy');

  return (
    <VisionContext.Provider value={{ params, setParams, viewMode, setViewMode }}>
      {children}
    </VisionContext.Provider>
  );
}

export function useVision() {
  const context = useContext(VisionContext);
  if (!context) {
    throw new Error('useVision must be used within a VisionProvider');
  }
  return context;
}
