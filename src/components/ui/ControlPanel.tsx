import { useVision, CameraAngle } from '../../contexts/VisionContext';

export default function ControlPanel() {
  const { params, setParams, viewMode, setViewMode, autoRotate, setAutoRotate, cameraAngle, setCameraAngle } = useVision();

  const handleSphereChange = (value: number) => {
    setParams({ ...params, sphere: value });
  };

  const handleCylinderChange = (value: number) => {
    setParams({ ...params, cylinder: value });
  };

  const handleAxisChange = (value: number) => {
    setParams({ ...params, axis: value });
  };

  const angles: { key: CameraAngle; label: string }[] = [
    { key: 'front', label: '前' },
    { key: 'top', label: '上' },
    { key: 'bottom', label: '下' },
    { key: 'left', label: '左' },
    { key: 'right', label: '右' },
  ];

  return (
    <div className="bg-slate-900 text-white p-6 rounded-lg shadow-xl">
      <h2 className="text-xl font-bold mb-6 text-sky-400">视力参数</h2>

      {/* 视角切换 */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-slate-300">查看模式</label>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('anatomy')}
            className={`flex-1 py-2 px-4 rounded-lg transition-all ${
              viewMode === 'anatomy'
                ? 'bg-sky-500 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            解剖视图
          </button>
          <button
            onClick={() => setViewMode('simulation')}
            className={`flex-1 py-2 px-4 rounded-lg transition-all ${
              viewMode === 'simulation'
                ? 'bg-sky-500 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            视觉模拟
          </button>
        </div>
      </div>

      {/* 解剖视图控制按钮 */}
      {viewMode === 'anatomy' && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-slate-300">视角控制</label>

          {/* 旋转控制 */}
          <div className="mb-3">
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`w-full py-2 px-4 rounded-lg transition-all ${
                autoRotate
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {autoRotate ? '⏸ 暂停旋转' : '▶ 开始旋转'}
            </button>
          </div>

          {/* 方向按钮 */}
          <div className="grid grid-cols-5 gap-1">
            <div></div>
            <button
              onClick={() => setCameraAngle('top')}
              className={`py-2 rounded-lg transition-all ${
                cameraAngle === 'top'
                  ? 'bg-sky-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              ↑
            </button>
            <div></div>
            <button
              onClick={() => setCameraAngle('left')}
              className={`py-2 rounded-lg transition-all ${
                cameraAngle === 'left'
                  ? 'bg-sky-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              ←
            </button>
            <button
              onClick={() => setCameraAngle('front')}
              className={`py-2 rounded-lg transition-all ${
                cameraAngle === 'front'
                  ? 'bg-sky-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              ●
            </button>
            <button
              onClick={() => setCameraAngle('right')}
              className={`py-2 rounded-lg transition-all ${
                cameraAngle === 'right'
                  ? 'bg-sky-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              →
            </button>
            <div></div>
            <button
              onClick={() => setCameraAngle('bottom')}
              className={`py-2 rounded-lg transition-all ${
                cameraAngle === 'bottom'
                  ? 'bg-sky-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              ↓
            </button>
            <div></div>
          </div>
        </div>
      )}

      {/* 球镜度数 */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-slate-300">
          球镜 (SPH): {params.sphere.toFixed(2)} D
        </label>
        <input
          type="range"
          min="-10"
          max="10"
          step="0.25"
          value={params.sphere}
          onChange={(e) => handleSphereChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>-10.00 (高度近视)</span>
          <span>0 (正常)</span>
          <span>+10.00 (远视)</span>
        </div>
      </div>

      {/* 柱镜度数 */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-slate-300">
          柱镜 (CYL): {params.cylinder.toFixed(2)} D
        </label>
        <input
          type="range"
          min="-6"
          max="0"
          step="0.25"
          value={params.cylinder}
          onChange={(e) => handleCylinderChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>0 (无散光)</span>
          <span>-6.00 (高度散光)</span>
        </div>
      </div>

      {/* 轴向 */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-slate-300">
          轴向 (Axis): {params.axis}°
        </label>
        <input
          type="range"
          min="0"
          max="180"
          step="1"
          value={params.axis}
          onChange={(e) => handleAxisChange(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>0°</span>
          <span>90°</span>
          <span>180°</span>
        </div>
      </div>

      {/* 参数说明 */}
      <div className="mt-8 p-4 bg-slate-800 rounded-lg">
        <h3 className="text-sm font-medium mb-2 text-sky-400">参数说明</h3>
        <ul className="text-xs text-slate-400 space-y-1">
          <li>• <strong className="text-slate-300">球镜(SPH)</strong>: 近视或远视度数，负值为近视</li>
          <li>• <strong className="text-slate-300">柱镜(CYL)</strong>: 散光度数，影响光线聚焦</li>
          <li>• <strong className="text-slate-300">轴向(Axis)</strong>: 散光的方向角度</li>
        </ul>
      </div>
    </div>
  );
}
