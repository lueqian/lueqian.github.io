export interface LeaderItem {
  id: string;
  name: string;
  policeId: string;
  phone: string;
  department?: string[]; // 所在部门级联数组，如 ['淮安区', '镇淮楼派出所']
  title?: string;
  unit?: string;
}

export interface DeptCascadeOption {
  value: string;
  label: string;
  children?: DeptCascadeOption[];
}

// 系统中统一的部门级联数据表
export const departmentCascadeOptions: DeptCascadeOption[] = [
  {
    value: '市局直属',
    label: '市局直属',
    children: [
      { value: '指挥中心', label: '指挥中心' },
      { value: '舆情总队', label: '舆情总队' },
      { value: '网安支队', label: '网安支队' },
      { value: '治安支队', label: '治安支队' },
      { value: '刑侦支队', label: '刑侦支队' },
    ],
  },
  {
    value: '淮安区',
    label: '淮安区',
    children: [
      { value: '镇淮楼派出所', label: '镇淮楼派出所' },
      { value: '河下派出所', label: '河下派出所' },
      { value: '城东派出所', label: '城东派出所' },
      { value: '淮安区网安大队', label: '淮安区网安大队' },
      { value: '淮安区刑警大队', label: '淮安区刑警大队' },
    ],
  },
  {
    value: '渝北区',
    label: '渝北区',
    children: [
      { value: '仙桃派出所', label: '仙桃派出所' },
      { value: '龙溪派出所', label: '龙溪派出所' },
      { value: '双凤桥派出所', label: '双凤桥派出所' },
      { value: '渝北区网安大队', label: '渝北区网安大队' },
    ],
  },
  {
    value: '渝中区',
    label: '渝中区',
    children: [
      { value: '解放碑派出所', label: '解放碑派出所' },
      { value: '大阳沟派出所', label: '大阳沟派出所' },
      { value: '上清寺派出所', label: '上清寺派出所' },
      { value: '渝中区网安大队', label: '渝中区网安大队' },
    ],
  },
  {
    value: '沙坪坝区',
    label: '沙坪坝区',
    children: [
      { value: '磁器口派出所', label: '磁器口派出所' },
      { value: '沙坪坝派出所', label: '沙坪坝派出所' },
      { value: '小龙坎派出所', label: '小龙坎派出所' },
    ],
  },
  {
    value: '江北区',
    label: '江北区',
    children: [
      { value: '观音桥派出所', label: '观音桥派出所' },
      { value: '石马河派出所', label: '石马河派出所' },
      { value: '江北区网安大队', label: '江北区网安大队' },
    ],
  },
  {
    value: '合川区',
    label: '合川区',
    children: [
      { value: '合阳派出所', label: '合阳派出所' },
      { value: '合川区网安大队', label: '合川区网安大队' },
    ],
  },
  {
    value: '大足区',
    label: '大足区',
    children: [
      { value: '棠香派出所', label: '棠香派出所' },
      { value: '大足区网安大队', label: '大足区网安大队' },
    ],
  },
];

// 预置默认领导列表数据
export const initialLeaders: LeaderItem[] = [
  {
    id: 'ld-1',
    name: '李广正',
    policeId: 'POL-023001',
    phone: '13908312345',
    department: ['市局直属', '舆情总队'],
    unit: '总2_舆情',
  },
  {
    id: 'ld-2',
    name: '张建国',
    policeId: 'POL-023002',
    phone: '13802398877',
    department: ['市局直属', '指挥中心'],
    unit: '总1_指挥',
  },
  {
    id: 'ld-3',
    name: '王强',
    policeId: 'POL-023003',
    phone: '13702387766',
    department: ['淮安区', '镇淮楼派出所'],
    unit: '淮安区局',
  },
  {
    id: 'ld-4',
    name: '陈明',
    policeId: 'POL-023004',
    phone: '13602376655',
    department: ['渝中区', '解放碑派出所'],
    unit: '渝中分局',
  },
  {
    id: 'ld-5',
    name: '郑江',
    policeId: 'POL-023005',
    phone: '15310399665',
    department: ['市局直属', '网安支队'],
    unit: '网安二大队',
  },
  {
    id: 'ld-6',
    name: '赵铁军',
    policeId: 'POL-023006',
    phone: '18902319988',
    department: ['渝北区', '仙桃派出所'],
    unit: '渝北分局',
  },
];

const LOCAL_STORAGE_KEY = 'blue_eagle_leaders_data_v3';
const DUTY_LEADER_STORAGE_KEY = 'blue_eagle_current_duty_leader_v3';

type Listener = (leaders: LeaderItem[]) => void;
type DutyListener = (dutyLeaderName: string) => void;

const listeners = new Set<Listener>();
const dutyListeners = new Set<DutyListener>();

function loadLeaders(): LeaderItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load leaders from localStorage:', e);
  }
  return [...initialLeaders];
}

function loadDutyLeader(): string {
  try {
    const val = localStorage.getItem(DUTY_LEADER_STORAGE_KEY);
    if (val) return val;
  } catch (e) {}
  return '李广正';
}

function saveLeaders(leaders: LeaderItem[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(leaders));
  } catch (e) {
    console.error('Failed to save leaders to localStorage:', e);
  }
  notifyListeners(leaders);
}

function notifyListeners(leaders: LeaderItem[]) {
  listeners.forEach((fn) => fn(leaders));
}

function notifyDutyListeners(name: string) {
  dutyListeners.forEach((fn) => fn(name));
}

let currentLeaders: LeaderItem[] = loadLeaders();
let currentDutyLeaderName: string = loadDutyLeader();

export const leaderStore = {
  getLeaders(): LeaderItem[] {
    return [...currentLeaders];
  },

  getDutyLeader(): string {
    return currentDutyLeaderName;
  },

  setDutyLeader(name: string) {
    currentDutyLeaderName = name;
    try {
      localStorage.setItem(DUTY_LEADER_STORAGE_KEY, name);
    } catch (e) {}
    notifyDutyListeners(name);
  },

  isLeaderOnDuty(name: string): boolean {
    return currentDutyLeaderName === name;
  },

  addLeader(item: Omit<LeaderItem, 'id'>): LeaderItem {
    const newLeader: LeaderItem = {
      ...item,
      id: 'ld-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    };
    currentLeaders = [newLeader, ...currentLeaders];
    saveLeaders(currentLeaders);
    return newLeader;
  },

  updateLeader(id: string, updates: Partial<Omit<LeaderItem, 'id'>>): boolean {
    const index = currentLeaders.findIndex((item) => item.id === id);
    if (index === -1) return false;
    const oldName = currentLeaders[index].name;
    currentLeaders[index] = {
      ...currentLeaders[index],
      ...updates,
    };
    if (updates.name && currentDutyLeaderName === oldName) {
      this.setDutyLeader(updates.name);
    }
    currentLeaders = [...currentLeaders];
    saveLeaders(currentLeaders);
    return true;
  },

  deleteLeader(id: string): { success: boolean; message?: string } {
    const leader = currentLeaders.find((item) => item.id === id);
    if (!leader) return { success: false, message: '未找到领导信息' };

    if (this.isLeaderOnDuty(leader.name)) {
      return {
        success: false,
        message: `领导【${leader.name}】当前正处于值班表中值班状态，无法删除！请先在今日值班表中更换值班领导。`,
      };
    }

    currentLeaders = currentLeaders.filter((item) => item.id !== id);
    saveLeaders(currentLeaders);
    return { success: true };
  },

  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  subscribeDutyLeader(listener: DutyListener): () => void {
    dutyListeners.add(listener);
    return () => {
      dutyListeners.delete(listener);
    };
  },
};
