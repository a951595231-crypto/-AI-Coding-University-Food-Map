import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import RestaurantCard from '../components/RestaurantCard';
import { allScenarios } from '../data/scenarios';
import { getRestaurantsByScenario } from '../data/restaurants';

export default function SceneRestaurants() {
  const { sceneId } = useParams();
  const navigate = useNavigate();

  const scene = allScenarios.find(s => s.id === sceneId);
  const list = getRestaurantsByScenario(sceneId);

  if (!scene) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        场景不存在
      </div>
    );
  }

  return (
    <div className="pb-4">
      <div className="px-5 pt-10 pb-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{scene.icon}</span>
            <h1 className="text-lg font-bold text-gray-900">{scene.name}</h1>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{scene.desc} · {list.length}家餐厅</p>
        </div>
      </div>

      <div className="px-4 space-y-3">
        {list.map((r, i) => (
          <RestaurantCard key={r.id} restaurant={r} index={i} />
        ))}
        {list.length === 0 && (
          <div className="text-center py-16 text-gray-300">
            <p className="text-4xl mb-3">{scene.icon}</p>
            <p className="text-sm">该场景暂无餐厅</p>
          </div>
        )}
      </div>
    </div>
  );
}
