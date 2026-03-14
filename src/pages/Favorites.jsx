import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import restaurants from '../data/restaurants';
import { ArrowLeft, Star, Check, Plus, Pencil, Trash2, MoreHorizontal, Lock, ChevronRight, FolderPlus } from 'lucide-react';

const defaultGroups = [
  { id: 'default', name: '默认收藏', note: '', isPrivate: false },
];

export default function Favorites() {
  const navigate = useNavigate();
  const { prefs, toggleFavorite, updatePrefs } = useUser();
  const [groups, setGroups] = useState(prefs.favoriteGroups || defaultGroups);
  const [assignments, setAssignments] = useState(prefs.favoriteAssignments || {});
  const [activeFolder, setActiveFolder] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState([]);
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupNote, setNewGroupNote] = useState('');
  const [editingGroup, setEditingGroup] = useState(null);
  const [editGroupName, setEditGroupName] = useState('');
  const [editGroupNote, setEditGroupNote] = useState('');
  const [showMoveSheet, setShowMoveSheet] = useState(false);

  const favRestaurants = restaurants.filter(r => prefs.favorites?.includes(r.id));

  const getGroupItems = (groupId) => {
    if (groupId === 'all') return favRestaurants;
    return favRestaurants.filter(r => (assignments[r.id] || 'default') === groupId);
  };

  const getGroupCovers = (groupId) => {
    const items = getGroupItems(groupId);
    return items.slice(0, 4).map(r => r.image);
  };

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const batchDelete = () => {
    selected.forEach(id => toggleFavorite(id));
    setSelected([]);
    setEditMode(false);
  };

  const batchMove = (groupId) => {
    const next = { ...assignments };
    selected.forEach(id => { next[id] = groupId; });
    setAssignments(next);
    updatePrefs({ favoriteAssignments: next });
    setSelected([]);
    setShowMoveSheet(false);
  };

  const addGroup = () => {
    if (newGroupName.trim()) {
      const id = 'g_' + Date.now();
      const updated = [...groups, { id, name: newGroupName.trim(), note: newGroupNote.trim(), isPrivate: false }];
      setGroups(updated);
      updatePrefs({ favoriteGroups: updated });
      setNewGroupName('');
      setNewGroupNote('');
      setShowAddGroup(false);
    }
  };

  const startEditGroup = (g, e) => {
    e.stopPropagation();
    setEditingGroup(g.id);
    setEditGroupName(g.name);
    setEditGroupNote(g.note || '');
  };

  const saveEditGroup = () => {
    if (!editGroupName.trim()) return;
    const updated = groups.map(g =>
      g.id === editingGroup ? { ...g, name: editGroupName.trim(), note: editGroupNote.trim() } : g
    );
    setGroups(updated);
    updatePrefs({ favoriteGroups: updated });
    setEditingGroup(null);
  };

  const deleteGroup = (groupId) => {
    const updated = groups.filter(g => g.id !== groupId);
    setGroups(updated);
    updatePrefs({ favoriteGroups: updated });
    const nextAssign = { ...assignments };
    Object.keys(nextAssign).forEach(k => {
      if (nextAssign[k] === groupId) delete nextAssign[k];
    });
    setAssignments(nextAssign);
    updatePrefs({ favoriteAssignments: nextAssign });
    setEditingGroup(null);
    if (activeFolder === groupId) setActiveFolder(null);
  };

  const displayList = activeFolder ? getGroupItems(activeFolder) : [];
  const activeFolderData = groups.find(g => g.id === activeFolder);

  if (activeFolder) {
    return (
      <div className="pb-20 min-h-screen bg-white">
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 pt-12">
          <div className="flex items-center justify-between px-4 h-11">
            <button onClick={() => { setActiveFolder(null); setEditMode(false); setSelected([]); }} className="w-8 h-8 flex items-center justify-center">
              <ArrowLeft size={20} className="text-gray-700" />
            </button>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-800">{activeFolderData?.name || '全部收藏'}</p>
              <p className="text-[10px] text-gray-400">{displayList.length}个内容</p>
            </div>
            <button
              onClick={() => { setEditMode(!editMode); setSelected([]); }}
              className="text-sm text-brand-500 font-medium"
            >
              {editMode ? '完成' : '管理'}
            </button>
          </div>
        </div>

        {editMode && selected.length > 0 && (
          <div className="sticky top-[5.75rem] z-20 bg-white border-b border-gray-100 px-4 py-2 flex items-center gap-2">
            <button onClick={() => setSelected(displayList.map(r => r.id))} className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
              全选
            </button>
            <button onClick={() => setShowMoveSheet(true)} className="text-xs text-brand-500 bg-brand-50 px-3 py-1.5 rounded-full flex items-center gap-1">
              <FolderPlus size={11} /> 移动到
            </button>
            <div className="flex-1" />
            <button onClick={batchDelete} className="text-xs text-red-500 bg-red-50 px-3 py-1.5 rounded-full flex items-center gap-1">
              <Trash2 size={11} /> 取消收藏 ({selected.length})
            </button>
          </div>
        )}

        <div className="px-4 pt-3 space-y-2.5">
          {displayList.map(r => (
            <div
              key={r.id}
              className={`flex items-center gap-3 bg-white rounded-2xl p-3 border shadow-sm transition-all ${
                editMode && selected.includes(r.id) ? 'border-brand-400 ring-2 ring-brand-100' : 'border-gray-100'
              }`}
              onClick={() => editMode ? toggleSelect(r.id) : navigate(`/restaurant/${r.id}`)}
            >
              {editMode && (
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  selected.includes(r.id) ? 'bg-brand-500 border-brand-500' : 'border-gray-300'
                }`}>
                  {selected.includes(r.id) && <Check size={12} className="text-white" />}
                </div>
              )}
              <img src={r.image} alt={r.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="text-[13px] font-semibold text-gray-800 line-clamp-1">{r.name}</h3>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star size={10} className="text-amber-400 fill-amber-400" />
                  <span className="text-[11px] text-gray-500">{r.rating}</span>
                  <span className="text-[10px] text-gray-300 ml-0.5">¥{r.avgPrice}/人</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5 truncate">{r.categoryTag} · {r.distance}</p>
              </div>
              {!editMode && <ChevronRight size={14} className="text-gray-200 flex-shrink-0" />}
            </div>
          ))}
        </div>

        {displayList.length === 0 && (
          <div className="text-center py-20 text-gray-300">
            <p className="text-4xl mb-3">⭐</p>
            <p className="text-sm">该收藏夹还是空的</p>
          </div>
        )}

        {showMoveSheet && (
          <div className="fixed inset-0 z-50 flex items-end bg-black/40" onClick={() => setShowMoveSheet(false)}>
            <div className="bg-white w-full rounded-t-3xl p-5 pb-8 animate-slide-up" onClick={e => e.stopPropagation()}>
              <h3 className="text-base font-bold text-gray-900 mb-4">移动到收藏夹</h3>
              <div className="space-y-2">
                {groups.map(g => (
                  <button
                    key={g.id}
                    onClick={() => batchMove(g.id)}
                    className="w-full text-left px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-sm text-gray-700 transition-colors flex items-center justify-between"
                  >
                    {g.name}
                    <span className="text-[11px] text-gray-400">{getGroupItems(g.id).length}个</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setShowMoveSheet(false)} className="w-full mt-3 h-11 bg-gray-100 rounded-xl text-sm text-gray-500">取消</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="pb-20 min-h-screen bg-white">
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 pt-12">
        <div className="flex items-center justify-between px-4 h-11">
          <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center">
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <span className="text-sm font-semibold text-gray-800">我的收藏</span>
          <div className="w-8" />
        </div>
      </div>

      <div className="px-4 pt-4">
        <button
          onClick={() => setActiveFolder('all')}
          className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-2xl mb-4 active:bg-gray-100 transition-colors"
        >
          <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl flex items-center justify-center">
            <Star size={24} className="text-amber-400 fill-amber-400" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-[15px] font-semibold text-gray-800">全部收藏</p>
            <p className="text-xs text-gray-400 mt-0.5">{favRestaurants.length}个内容</p>
          </div>
          <ChevronRight size={16} className="text-gray-300" />
        </button>

        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-700">收藏夹</p>
          <button
            onClick={() => setShowAddGroup(true)}
            className="text-xs text-brand-500 flex items-center gap-1 font-medium"
          >
            <Plus size={14} /> 新建
          </button>
        </div>

        <div className="space-y-2.5">
          {groups.map(g => {
            const covers = getGroupCovers(g.id);
            const count = getGroupItems(g.id).length;
            return (
              <div
                key={g.id}
                onClick={() => setActiveFolder(g.id)}
                className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3 cursor-pointer active:bg-gray-100 transition-colors"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                  {covers[0] ? (
                    <img src={covers[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <Star size={20} className="text-amber-300 fill-amber-300" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold text-gray-800 truncate">{g.name}</p>
                    {g.isPrivate && <Lock size={11} className="text-gray-400 flex-shrink-0" />}
                  </div>
                  {g.note && <p className="text-[10px] text-gray-400 mt-0.5 truncate">{g.note}</p>}
                  <p className="text-[11px] text-gray-400 mt-0.5">{count}个内容</p>
                </div>
                {g.id !== 'default' ? (
                  <button
                    onClick={(e) => startEditGroup(g, e)}
                    className="w-7 h-7 flex items-center justify-center text-gray-300 hover:text-gray-500 flex-shrink-0"
                  >
                    <MoreHorizontal size={16} />
                  </button>
                ) : (
                  <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {groups.length === 1 && (
          <p className="text-center text-xs text-gray-300 mt-6">点击「新建」创建更多收藏夹来归类你的美食</p>
        )}
      </div>

      {editingGroup && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40" onClick={() => setEditingGroup(null)}>
          <div className="bg-white w-full rounded-t-3xl p-5 pb-8 animate-slide-up" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-bold text-gray-900 mb-4">编辑收藏夹</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400 mb-1.5">名称</p>
                <input
                  type="text"
                  value={editGroupName}
                  onChange={(e) => setEditGroupName(e.target.value.slice(0, 10))}
                  className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-200"
                  autoFocus
                />
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1.5">备注</p>
                <input
                  type="text"
                  value={editGroupNote}
                  onChange={(e) => setEditGroupNote(e.target.value.slice(0, 20))}
                  placeholder="选填"
                  className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-200"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => deleteGroup(editingGroup)} className="h-11 px-4 text-sm text-red-500 bg-red-50 rounded-xl flex items-center gap-1.5">
                <Trash2 size={14} /> 删除
              </button>
              <div className="flex-1" />
              <button onClick={() => setEditingGroup(null)} className="h-11 px-5 text-sm text-gray-500 bg-gray-100 rounded-xl">取消</button>
              <button onClick={saveEditGroup} className="h-11 px-5 text-sm text-white bg-brand-500 rounded-xl font-medium">保存</button>
            </div>
          </div>
        </div>
      )}

      {showAddGroup && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40" onClick={() => setShowAddGroup(false)}>
          <div className="bg-white w-full rounded-t-3xl p-5 pb-8 animate-slide-up" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-bold text-gray-900 mb-4">新建收藏夹</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400 mb-1.5">名称</p>
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value.slice(0, 10))}
                  placeholder="收藏夹名称"
                  className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-200"
                  autoFocus
                />
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1.5">备注</p>
                <input
                  type="text"
                  value={newGroupNote}
                  onChange={(e) => setNewGroupNote(e.target.value.slice(0, 20))}
                  placeholder="选填"
                  className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-200"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowAddGroup(false)} className="flex-1 h-11 text-sm text-gray-500 bg-gray-100 rounded-xl">取消</button>
              <button onClick={addGroup} className="flex-1 h-11 text-sm text-white bg-brand-500 rounded-xl font-medium">创建</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
