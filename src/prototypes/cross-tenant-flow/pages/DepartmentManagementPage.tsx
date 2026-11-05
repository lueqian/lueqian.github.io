import React, { useState, useMemo } from 'react';
import {
  Input,
  Button,
  Table,
  Modal,
  Form,
  Select,
  Popconfirm,
  Pagination,
  message
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SwapOutlined,
  RightOutlined,
  DownOutlined
} from '@ant-design/icons';
import { useAppStore } from '../store';
import { DepartmentNode, DeptUserItem } from '../types';

export const DepartmentManagementPage: React.FC = () => {
  const {
    deptTreeData,
    selectedDeptKey,
    selectedDeptName,
    deptUsers,
    setSelectedDept,
    openEditDeptModal,
    deleteDepartment,
    toggleAllUsersStatus,
    deleteUser,
    resetUserPassword,
    addUser,
    exportInviteCodeUsers
  } = useAppStore();

  // 搜索过滤与展开控制
  const [deptSearchText, setDeptSearchText] = useState('');
  const [userSearchText, setUserSearchText] = useState('');
  const [expandedKeys, setExpandedKeys] = useState<string[]>([
    'dept-wangan',
    'dept-branch'
  ]);
  const [hoveredNodeKey, setHoveredNodeKey] = useState<string | null>(null);

  // 用户新增/编辑弹窗
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<DeptUserItem | null>(null);
  const [userForm] = Form.useForm();

  // 当前分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const toggleExpand = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // 递归查找当前选中的部门节点
  const findNode = (nodes: DepartmentNode[], key: string): DepartmentNode | null => {
    for (const node of nodes) {
      if (node.key === key) return node;
      if (node.children) {
        const found = findNode(node.children, key);
        if (found) return found;
      }
    }
    return null;
  };

  const currentSelectedNode = useMemo(() => {
    if (selectedDeptName === '全部用户') return null;
    return findNode(deptTreeData, selectedDeptKey) || {
      key: 'dept-zhongxian',
      title: '忠县',
      unitType: '区县单位' as const,
      superiorAuditDept: '网安支队',
      requireCityAudit: true
    };
  }, [deptTreeData, selectedDeptKey, selectedDeptName]);

  // 过滤后的用户列表
  const filteredUsers = useMemo(() => {
    return deptUsers.filter((u) => {
      const matchesDept =
        !selectedDeptName || selectedDeptName === '全部用户' || u.department === selectedDeptName;
      const matchesSearch =
        !userSearchText || u.userName.includes(userSearchText) || u.phone.includes(userSearchText);
      return matchesDept && matchesSearch;
    });
  }, [deptUsers, selectedDeptName, userSearchText]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  // 打开新增/编辑用户弹窗
  const handleOpenUserModal = (user?: DeptUserItem) => {
    if (user) {
      setEditingUser(user);
      userForm.setFieldsValue({
        userName: user.userName,
        department: user.department,
        role: user.role,
        wechatNick: user.wechatNick,
        idCard: user.idCard,
        phone: user.phone
      });
    } else {
      setEditingUser(null);
      userForm.setFieldsValue({
        userName: '',
        department: selectedDeptName !== '全部用户' ? selectedDeptName : '忠县',
        role: '区县一体化角色',
        wechatNick: '',
        idCard: '',
        phone: ''
      });
    }
    setUserModalOpen(true);
  };

  const handleUserFormSubmit = (values: any) => {
    if (editingUser) {
      message.success(`用户【${values.userName}】信息修改成功`);
    } else {
      addUser(values);
    }
    setUserModalOpen(false);
  };

  // 递归渲染部门树节点
  const renderDepartmentTree = (nodes: DepartmentNode[], level: number = 0) => {
    return nodes.map((node) => {
      const hasChildren = node.children && node.children.length > 0;
      const isExpanded = expandedKeys.includes(node.key);
      const isSelected = selectedDeptKey === node.key && selectedDeptName !== '全部用户';
      const isHovered = hoveredNodeKey === node.key;

      // 判断单位级别：通过 isSubordinate 开关判断；未开启为上级部门（市局），开启为下级单位（区县）
      const isSub =
        node.isSubordinate !== undefined
          ? node.isSubordinate
          : !(
              node.unitType === '市局单位' ||
              node.key === 'dept-wangan' ||
              node.key === 'dept-headquarters' ||
              node.key === 'dept-branch' ||
              node.title === '网安' ||
              node.title === '总公司'
            );
      const isMunicipal = !isSub;

      // 搜索过滤匹配
      if (deptSearchText && !node.title.toLowerCase().includes(deptSearchText.toLowerCase())) {
        const hasMatchingChild = node.children?.some((c) =>
          c.title.toLowerCase().includes(deptSearchText.toLowerCase())
        );
        if (!hasMatchingChild) return null;
      }


      return (
        <div key={node.key} className="select-none">
          {/* 单行节点容器 */}
          <div
            onClick={() => setSelectedDept(node.key, node.title)}
            onMouseEnter={() => setHoveredNodeKey(node.key)}
            onMouseLeave={() => setHoveredNodeKey(null)}
            style={{ paddingLeft: `${level * 16 + 8}px` }}
            className={`group flex items-center justify-between py-1.5 pr-2 rounded cursor-pointer transition-colors text-xs ${
              isSelected
                ? 'bg-[#e6f7ff] text-[#1677ff] font-medium'
                : 'hover:bg-slate-50 text-slate-700'
            }`}
          >
            {/* 左侧：展开折叠图标 + [市局]/[区县]标签 + 部门名称 */}
            <div className="flex items-center gap-1 min-w-0 flex-1">
              {hasChildren ? (
                <span
                  onClick={(e) => toggleExpand(node.key, e)}
                  className="w-4 h-4 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-transform"
                >
                  {isExpanded ? (
                    <DownOutlined className="text-[10px]" />
                  ) : (
                    <RightOutlined className="text-[10px]" />
                  )}
                </span>
              ) : (
                <span className="w-4" />
              )}

              {/* 蓝底白字[市局] 或 绿底白字[区县] 标签 */}
              {isMunicipal ? (
                <span className="inline-flex items-center px-1 py-0 text-[10px] font-medium bg-[#1677ff] text-white rounded-xs leading-none mr-1 flex-shrink-0 shadow-2xs">
                  市局
                </span>
              ) : (
                <span className="inline-flex items-center px-1 py-0 text-[10px] font-medium bg-[#52c41a] text-white rounded-xs leading-none mr-1 flex-shrink-0 shadow-2xs">
                  区县
                </span>
              )}

              {/* 部门标题 */}
              <span className="truncate">{node.title}</span>
            </div>

            {/* 右侧悬浮/激活操作图标组：+ 添加子部门、✎ 编辑部门、🗑 删除部门 */}
            {(isSelected || isHovered) && (
              <div
                className="flex items-center gap-1.5 flex-shrink-0 ml-1"
                onClick={(e) => e.stopPropagation()}
              >
                {/* 添加子部门 */}
                <span
                  onClick={() => openEditDeptModal(undefined, 'add')}
                  className="w-4 h-4 rounded flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors"
                  title="添加子部门"
                >
                  <PlusOutlined className="text-[10px]" />
                </span>

                {/* 编辑部门 */}
                <span
                  onClick={() => openEditDeptModal(node, 'edit')}
                  className="w-4 h-4 rounded flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors"
                  title="编辑部门"
                >
                  <EditOutlined className="text-[10px]" />
                </span>

                {/* 删除部门 */}
                <Popconfirm
                  title={`确认删除部门【${node.title}】及其下辖数据？`}
                  onConfirm={() => deleteDepartment(node.key)}
                  okText="确认删除"
                  cancelText="取消"
                  placement="right"
                >
                  <span
                    className="w-4 h-4 rounded flex items-center justify-center text-blue-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="删除部门"
                  >
                    <DeleteOutlined className="text-[10px]" />
                  </span>
                </Popconfirm>
              </div>
            )}
          </div>

          {/* 子节点递归渲染 */}
          {hasChildren && isExpanded && (
            <div className="space-y-0.5">
              {renderDepartmentTree(node.children!, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  // 用户表格列定义
  const columns = [
    {
      title: '序号',
      dataIndex: 'serialNumber',
      key: 'serialNumber',
      width: 60,
      align: 'center' as const,
      render: (val: number) => <span className="text-slate-500 font-mono text-xs">{val}</span>
    },
    {
      title: '用户名称',
      dataIndex: 'userName',
      key: 'userName',
      width: 95,
      render: (val: string) => <span className="font-semibold text-slate-800 text-xs">{val}</span>
    },
    {
      title: '所属部门',
      dataIndex: 'department',
      key: 'department',
      width: 85,
      render: (val: string) => <span className="text-slate-600 text-xs">{val}</span>
    },
    {
      title: '用户角色',
      dataIndex: 'role',
      key: 'role',
      width: 170,
      render: (val: string) => <span className="text-slate-700 text-xs">{val}</span>
    },
    {
      title: '微信昵称',
      dataIndex: 'wechatNick',
      key: 'wechatNick',
      width: 125,
      render: (val: string) => (
        <span className="text-slate-600 text-xs font-sans">
          {val || '-'}
        </span>
      )
    },
    {
      title: '身份证',
      dataIndex: 'idCard',
      key: 'idCard',
      width: 185,
      render: (val: string) => <span className="font-mono text-slate-600 text-xs tracking-tight">{val}</span>
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      width: 120,
      render: (val: string) => <span className="font-mono text-slate-600 text-xs">{val}</span>
    },
    {
      title: '激活状态',
      dataIndex: 'activeStatus',
      key: 'activeStatus',
      width: 90,
      render: (status: string) =>
        status === '已激活' ? (
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#f6ffed] border border-[#b7eb8f] text-[#52c41a]">
            已激活
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 border border-slate-300 text-slate-500">
            未激活
          </span>
        )
    },
    {
      title: '邀请码',
      dataIndex: 'inviteCode',
      key: 'inviteCode',
      width: 85,
      render: (val: string) => <span className="font-mono text-slate-500 text-xs">{val}</span>
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (_: any, record: DeptUserItem) => (
        <div className="flex items-center gap-3 text-xs">
          <span
            onClick={() => resetUserPassword(record.id)}
            className="text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
          >
            重置密码
          </span>
          <span
            onClick={() => handleOpenUserModal(record)}
            className="text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
          >
            编辑
          </span>
          <Popconfirm
            title={`确认删除用户【${record.userName}】？`}
            onConfirm={() => deleteUser(record.id)}
            okText="确认"
            cancelText="取消"
          >
            <span className="text-rose-500 hover:text-rose-600 hover:underline cursor-pointer">
              删除
            </span>
          </Popconfirm>
        </div>
      )
    }
  ];

  return (
    <div className="flex h-full w-full bg-white select-none overflow-hidden">
      {/* 1. 左侧部门树面板 (固定 280px 宽度) */}
      <aside className="w-[280px] min-w-[280px] max-w-[280px] h-full bg-white border-r border-[#e8e8e8] flex flex-col justify-between select-none">
        {/* 上部：标题、添加部门、搜索框、全部用户、部门树 */}
        <div className="flex flex-col h-full overflow-hidden p-3 pb-1">
          {/* 顶部标题与添加部门链接 */}
          <div className="flex items-center justify-between pb-2.5">
            <div className="flex items-center gap-1">
              <span className="font-bold text-slate-800 text-sm">部门列表</span>
              <SwapOutlined className="rotate-90 text-slate-400 text-xs cursor-pointer hover:text-blue-600" />
            </div>
            <span
              onClick={() => openEditDeptModal(undefined, 'add')}
              className="text-xs text-blue-600 hover:text-blue-700 hover:underline cursor-pointer font-medium"
            >
              添加部门
            </span>
          </div>

          {/* 部门搜索框 */}
          <div className="pb-2">
            <Input
              prefix={<SearchOutlined className="text-slate-400 text-xs" />}
              placeholder="搜索部门"
              value={deptSearchText}
              onChange={(e) => setDeptSearchText(e.target.value)}
              allowClear
              className="text-xs h-8 rounded"
            />
          </div>

          {/* 顶部通栏扁平按钮：全部用户 */}
          <div className="pb-2">
            <button
              onClick={() => {
                setSelectedDept('', '全部用户');
                message.info('已展示全单位用户总列表');
              }}
              className={`w-full py-1.5 px-3 rounded text-xs font-medium transition-colors shadow-2xs ${
                selectedDeptName === '全部用户'
                  ? 'bg-blue-700 text-white'
                  : 'bg-[#1677ff] hover:bg-blue-500 text-white'
              }`}
            >
              全部用户
            </button>
          </div>

          {/* 部门树滚动区 */}
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 pt-1 space-y-0.5">
            {renderDepartmentTree(deptTreeData)}
          </div>
        </div>

        {/* 底部固定通栏按钮：导出邀请码用户 */}
        <div className="p-3 border-t border-[#f0f0f0] bg-white">
          <button
            onClick={exportInviteCodeUsers}
            className="w-full bg-[#1677ff] hover:bg-blue-500 text-white py-2 px-3 rounded text-xs font-medium transition-colors shadow-xs flex items-center justify-center cursor-pointer"
          >
            导出邀请码用户
          </button>
        </div>
      </aside>

      {/* 2. 右侧用户列表与操作区 */}
      <main className="flex-1 h-full flex flex-col justify-between overflow-hidden bg-white p-5">
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* 顶部标题与批量操作工具栏 */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-3">
            {/* 左侧标题 + 面包屑标签 + 副标题上级审核与把关状态 */}
            {currentSelectedNode ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-[16px] font-bold text-slate-800 tracking-tight">
                    {currentSelectedNode.title}
                  </h2>
                  <span
                    className={`px-2 py-0.5 text-xs font-semibold rounded ${
                      currentSelectedNode.isSubordinate === false
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    [{currentSelectedNode.isSubordinate === false ? '上级部门' : '下级单位'}]
                  </span>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-2.5">
                  <span>
                    上级审核：
                    <strong className="text-slate-700 font-medium">
                      {currentSelectedNode.targetAuditDept ||
                        currentSelectedNode.superiorAuditDept ||
                        (currentSelectedNode.isSubordinate === false ? '直属市局' : '网安支队')}
                    </strong>
                  </span>
                  {currentSelectedNode.isSubordinate !== false && (
                    <>
                      <span className="text-slate-300">|</span>
                      <span>
                        上报需审核：
                        <strong
                          className={
                            currentSelectedNode.requireAudit !== false &&
                            currentSelectedNode.requireCityAudit !== false
                              ? 'text-amber-600 font-medium'
                              : 'text-slate-400 font-medium'
                          }
                        >
                          {currentSelectedNode.requireAudit !== false &&
                          currentSelectedNode.requireCityAudit !== false
                            ? '已开启'
                            : '未开启'}
                        </strong>
                      </span>
                    </>
                  )}
                </div>
              </div>
            ) : (

              <h2 className="text-[16px] font-bold text-slate-800 tracking-tight">
                全部用户列表
              </h2>
            )}

            {/* 右侧操作栏：一键开启、一键停用、请输入用户名、+ 新增用户 */}
            <div className="flex items-center gap-2.5">
              <Button
                type="primary"
                onClick={() => toggleAllUsersStatus('已激活')}
                className="!bg-[#1677ff] hover:!bg-blue-500 !text-xs !h-8 !px-3 shadow-2xs"
              >
                一键开启
              </Button>

              <Button
                onClick={() => toggleAllUsersStatus('未激活')}
                className="!bg-[#64748b] hover:!bg-[#475569] !text-white !border-transparent !text-xs !h-8 !px-3 shadow-2xs"
              >
                一键停用
              </Button>

              <Input
                placeholder="请输入用户名"
                value={userSearchText}
                onChange={(e) => setUserSearchText(e.target.value)}
                allowClear
                className="text-xs h-8 w-44"
                prefix={<SearchOutlined className="text-slate-400 text-xs" />}
              />

              <Button
                type="primary"
                onClick={() => handleOpenUserModal()}
                className="!bg-[#1677ff] hover:!bg-blue-500 !text-xs !h-8 !px-3.5 shadow-2xs flex items-center gap-1"
              >
                <PlusOutlined className="text-xs" />
                <span>新增用户</span>
              </Button>
            </div>
          </div>

          {/* 用户数据表格 */}
          <div className="flex-1 overflow-auto pt-2">
            <Table
              dataSource={paginatedUsers}
              columns={columns}
              rowKey="id"
              pagination={false}
              size="middle"
              className="border border-[#f0f0f0] rounded-sm text-xs"
              rowClassName="hover:bg-blue-50/40 transition-colors"
            />
          </div>
        </div>

        {/* 底部分页栏：左侧共 13 条，右侧简洁翻页器 */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 select-none">
          <div>
            共 <strong className="font-mono text-slate-800">{filteredUsers.length}</strong> 条
          </div>

          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredUsers.length}
            onChange={(page) => setCurrentPage(page)}
            size="small"
            showSizeChanger={false}
          />
        </div>
      </main>

      {/* 新增 / 编辑用户弹窗 */}
      <Modal
        title={
          <span className="text-sm font-bold text-slate-800">
            {editingUser ? '编辑用户信息' : '新增用户'}
          </span>
        }
        open={userModalOpen}
        onCancel={() => setUserModalOpen(false)}
        footer={null}
        width={460}
        centered
        destroyOnClose
      >
        <Form
          form={userForm}
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          onFinish={handleUserFormSubmit}
          className="mt-5 space-y-3"
        >
          <Form.Item
            label={<span className="text-xs text-slate-700">用户名称</span>}
            name="userName"
            rules={[{ required: true, message: '请输入用户真实姓名' }]}
          >
            <Input placeholder="请输入姓名" className="text-xs h-8" />
          </Form.Item>

          <Form.Item
            label={<span className="text-xs text-slate-700">所属部门</span>}
            name="department"
            rules={[{ required: true, message: '请选择所属部门' }]}
          >
            <Select
              className="text-xs h-8 w-full"
              options={[
                { value: '忠县', label: '忠县' },
                { value: '总公司', label: '总公司' },
                { value: '区县分公司', label: '区县分公司' },
                { value: '长寿区', label: '长寿区' },
                { value: '云阳县', label: '云阳县' },
                { value: '渝中区', label: '渝中区' },
                { value: '渝北区', label: '渝北区' }
              ]}
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-xs text-slate-700">用户角色</span>}
            name="role"
            rules={[{ required: true, message: '请选择用户角色' }]}
          >
            <Select
              className="text-xs h-8 w-full"
              options={[
                { value: '区县民警、区县一体化角色', label: '区县民警、区县一体化角色' },
                { value: '区县一体化角色', label: '区县一体化角色' },
                { value: '市局审核角色', label: '市局审核角色' },
                { value: '省厅指挥角色', label: '省厅指挥角色' }
              ]}
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-xs text-slate-700">微信昵称</span>}
            name="wechatNick"
          >
            <Input placeholder="请输入微信昵称（选填）" className="text-xs h-8" />
          </Form.Item>

          <Form.Item
            label={<span className="text-xs text-slate-700">身份证号</span>}
            name="idCard"
            rules={[{ required: true, message: '请输入 18 位身份证号码' }]}
          >
            <Input placeholder="请输入 18 位身份证" className="text-xs h-8 font-mono" />
          </Form.Item>

          <Form.Item
            label={<span className="text-xs text-slate-700">手机号码</span>}
            name="phone"
            rules={[{ required: true, message: '请输入手机号' }]}
          >
            <Input placeholder="请输入 11 位手机号" className="text-xs h-8 font-mono" />
          </Form.Item>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button onClick={() => setUserModalOpen(false)} className="!text-xs !h-8 !px-4">
              取消
            </Button>
            <Button type="primary" htmlType="submit" className="!bg-[#1677ff] !text-xs !h-8 !px-4">
              保存
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
