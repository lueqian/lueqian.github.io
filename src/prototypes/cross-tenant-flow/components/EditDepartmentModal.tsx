import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Switch, Button } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useAppStore } from '../store';

export const EditDepartmentModal: React.FC = () => {
  const {
    editDeptModalOpen,
    editingDeptData,
    editDeptMode,
    closeEditDeptModal,
    saveDepartment
  } = useAppStore();

  const [form] = Form.useForm();
  const requireAuditWatch = Form.useWatch('requireAudit', form);

  useEffect(() => {
    if (editDeptModalOpen) {
      if (editDeptMode === 'edit' && editingDeptData) {
        const isSub =
          editingDeptData.isSubordinate !== undefined
            ? editingDeptData.isSubordinate
            : editingDeptData.unitType !== '市局单位';
        const reqAudit =
          editingDeptData.requireAudit !== undefined
            ? editingDeptData.requireAudit
            : editingDeptData.requireCityAudit !== false;
        const targetDept =
          editingDeptData.targetAuditDept ||
          editingDeptData.superiorAuditDept ||
          '网安支队';

        form.setFieldsValue({
          title: editingDeptData.title || '区县分公司',
          phone: editingDeptData.phone || '',
          location: editingDeptData.location || undefined,
          isSubordinate: isSub,
          requireAudit: reqAudit,
          targetAuditDept: targetDept
        });
      } else {
        form.setFieldsValue({
          title: '',
          phone: '',
          location: undefined,
          isSubordinate: true,
          requireAudit: true,
          targetAuditDept: '网安支队'
        });
      }
    }
  }, [editDeptModalOpen, editingDeptData, editDeptMode, form]);

  const handleFinish = (values: any) => {
    const isSub = !!values.isSubordinate;
    const reqAudit = !!values.requireAudit;
    const targetDept = reqAudit ? (values.targetAuditDept || '网安支队') : undefined;

    saveDepartment({
      title: values.title,
      phone: values.phone,
      location: values.location,
      isSubordinate: isSub,
      unitType: isSub ? '区县单位' : '市局单位',
      requireAudit: reqAudit,
      requireCityAudit: reqAudit,
      targetAuditDept: targetDept,
      superiorAuditDept: targetDept || (isSub ? '网安支队' : '直属市局')
    });
  };

  return (
    <Modal
      title={
        <span className="text-[15px] font-bold text-slate-800 tracking-tight">
          {editDeptMode === 'edit' ? '编辑部门' : '添加部门'}
        </span>
      }
      open={editDeptModalOpen}
      onCancel={closeEditDeptModal}
      footer={null}
      width={480}
      centered
      destroyOnClose
      className="select-none rounded-lg"
    >
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        onFinish={handleFinish}
        className="mt-5 space-y-3.5"
      >
        {/* 1. 名称 */}
        <Form.Item
          label={<span className="text-xs text-slate-700 font-medium">名称</span>}
          name="title"
          rules={[{ required: true, message: '请输入部门名称' }]}
        >
          <Input
            placeholder="请输入部门名称"
            maxLength={50}
            showCount
            className="text-xs h-8"
          />
        </Form.Item>

        {/* 2. 值班电话 */}
        <Form.Item
          label={<span className="text-xs text-slate-700 font-medium">值班电话</span>}
          name="phone"
        >
          <Input
            placeholder="请输入值班电话"
            className="text-xs h-8"
          />
        </Form.Item>

        {/* 3. 涉事属地 */}
        <Form.Item
          label={<span className="text-xs text-slate-700 font-medium">涉事属地</span>}
          name="location"
          className="!mb-1"
        >
          <Select
            placeholder="请选择"
            allowClear
            className="text-xs h-8 w-full"
            options={[
              { value: '忠县', label: '忠县' },
              { value: '长寿区', label: '长寿区' },
              { value: '云阳县', label: '云阳县' },
              { value: '渝中区', label: '渝中区' },
              { value: '渝北区', label: '渝北区' },
              { value: '酉阳县', label: '酉阳县' },
              { value: '永川区', label: '永川区' },
              { value: '秀山县', label: '秀山县' },
              { value: '巫溪县', label: '巫溪县' },
              { value: '巫山县', label: '巫山县' },
              { value: '万州区', label: '万州区' },
              { value: '万盛区', label: '万盛区' },
              { value: '潼南区', label: '潼南区' },
              { value: '铜梁区', label: '铜梁区' },
              { value: '石柱县', label: '石柱县' },
              { value: '沙坪坝区', label: '沙坪坝区' },
              { value: '荣昌区', label: '荣昌区' },
              { value: '黔江区', label: '黔江区' },
              { value: '綦江区', label: '綦江区' },
              { value: '彭水县', label: '彭水县' }
            ]}
          />
        </Form.Item>

        <div className="ml-[25%] flex items-center gap-1.5 text-[11px] text-slate-400 pb-1">
          <InfoCircleOutlined className="text-xs text-slate-400" />
          <span>选择后主动发现该属地数据会自动分发至该部门</span>
        </div>

        {/* 4. 单位类型改造为单一开关：下级单位 */}
        <Form.Item
          label={<span className="text-xs text-slate-700 font-medium">下级单位</span>}
          name="isSubordinate"
          valuePropName="checked"
          className="!mb-1"
        >
          <Switch className="bg-slate-300" />
        </Form.Item>

        <div className="ml-[25%] flex items-center gap-1.5 text-[11px] text-slate-400 pb-1">
          <span>开启后，证明该部门属于下级单位，未开启为上级部门</span>
        </div>

        {/* 5. 关联开关：上报需审核 */}
        <Form.Item
          label={<span className="text-xs text-slate-700 font-medium">上报需审核</span>}
          name="requireAudit"
          valuePropName="checked"
          className="!mb-1"
        >
          <Switch className="bg-slate-300" />
        </Form.Item>

        <div className="ml-[25%] flex items-center gap-1.5 text-[11px] text-slate-400 pb-1">
          <span>开启控制上报需审核，并指定审核的目标部门</span>
        </div>

        {/* 6. 关联选项：开启“上报需审核”后显示审核的目标部门下拉选框，默认选中排序靠前的一个上级部门 */}
        {requireAuditWatch && (
          <Form.Item
            label={<span className="text-xs text-slate-700 font-medium">审核目标部门</span>}
            name="targetAuditDept"
            rules={[{ required: true, message: '请选择审核的目标部门' }]}
          >
            <Select
              placeholder="请选择审核的目标部门"
              className="text-xs h-8 w-full"
              options={[
                { value: '网安支队', label: '网安支队' },
                { value: '总公司', label: '总公司' }
              ]}
            />
          </Form.Item>
        )}

        {/* 弹窗底部操作按钮 */}
        <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
          <Button
            onClick={closeEditDeptModal}
            className="!text-xs !border-blue-500 !text-blue-600 hover:!bg-blue-50 !h-8 !px-4"
          >
            关闭
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            className="!text-xs !bg-blue-600 hover:!bg-blue-500 !h-8 !px-4 shadow-2xs"
          >
            提交
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
