import React, { useState, useCallback } from 'react';
import {
  SearchOutlined,
  DownOutlined,
  EditOutlined,
  SettingOutlined,
  EyeOutlined,
  SendOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

/** 模拟客户数据 */
const mockData = [
  { id: 'f4c51d03628b428c9a5b3e7f1d2c4a6b', name: 'JBGZLCSKH', industry: '网信办/舆情处', users: 2, role: '旧版工作流', sales: '', presales: '', applicant: '冯昱颖/陈伟基', regTime: '2026-04-18 15:25:03', expTime: '2026-07-18 00:00:00', enabled: true },
  { id: '3c82096816774368b4d2e1a5f6c7d8e9', name: 'YCYQGA', industry: '网信办/舆情处', users: 3, role: '煜橙渠道全网(请绝对不要修改)', sales: '周婕', presales: '', applicant: '', regTime: '2026-04-17 18:00:55', expTime: '2026-05-17 00:00:00', enabled: true },
  { id: 'db73ba24d2642b4e8f1a3c5d7e9b0a2f', name: '煜橙|太原万柏林公安', industry: '数源智汇', users: 4, role: '煜橙渠道全网(请绝对不要修改)', sales: '周婕', presales: '王波', applicant: '', regTime: '2026-04-17 10:47:39', expTime: '2026-07-17 00:00:00', enabled: true },
  { id: 'a1b2c3d4e5f6789012345678abcdef90', name: 'SXZH-YQJC-001', industry: '网信办/舆情处', users: 2, role: '标准工作流', sales: '周珂雯', presales: '刘洲', applicant: '冯昱颖', regTime: '2026-04-16 09:32:17', expTime: '2026-05-16 00:00:00', enabled: true },
  { id: 'b2c3d4e5f678901234567890abcdef01', name: '示范区网信办', industry: '网信办/舆情处', users: 3, role: '煜橙渠道全网(请绝对不要修改)', sales: '周婕', presales: '王波', applicant: '', regTime: '2026-04-16 09:43:12', expTime: '2026-07-16 00:00:00', enabled: true },
  { id: 'c3d4e5f678901234567890abcdef0123', name: 'SXZH-TEST-002', industry: '数源智汇', users: 1, role: '旧版工作流', sales: '', presales: '', applicant: '陈伟基', regTime: '2026-04-16 09:41:08', expTime: '2026-04-16 00:00:00', enabled: false },
  { id: 'd4e5f678901234567890abcdef012345', name: '太原市委网信办', industry: '网信办/舆情处', users: 5, role: '标准工作流', sales: '周珂雯', presales: '刘洲', applicant: '冯昱颖/陈伟基', regTime: '2026-04-16 09:39:55', expTime: '2026-07-16 00:00:00', enabled: true },
  { id: 'e5f678901234567890abcdef01234567', name: 'YCYQ-DEMO-003', industry: '数源智汇', users: 2, role: '煜橙渠道全网(请绝对不要修改)', sales: '周婕', presales: '', applicant: '', regTime: '2026-04-16 09:38:20', expTime: '2026-05-16 00:00:00', enabled: true },
  { id: 'f678901234567890abcdef0123456789a', name: '晋中市委网信办', industry: '网信办/舆情处', users: 3, role: '标准工作流', sales: '', presales: '王波', applicant: '冯昱颖', regTime: '2026-04-16 09:36:45', expTime: '2026-04-16 00:00:00', enabled: true },
  { id: '078901234567890abcdef0123456789ab', name: 'SXZH-YQ-004', industry: '数源智汇', users: 4, role: '旧版工作流', sales: '周珂雯', presales: '刘洲', applicant: '陈伟基', regTime: '2026-04-16 09:35:10', expTime: '2026-07-16 00:00:00', enabled: true },
];

interface CustomerListProps {
  onNavigate?: (path: string, label: string, params?: Record<string, string>) => void;
}

const CustomerList: React.FC<CustomerListProps> = ({ onNavigate }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [toastVisible, setToastVisible] = useState(false);
  const [tooltipInfo, setTooltipInfo] = useState<{ text: string; top: number; left: number } | null>(null);
  const [statusMap, setStatusMap] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    mockData.forEach((row) => { map[row.id] = row.enabled; });
    return map;
  });
  const pageSize = 10;
  const total = 1145;

  const totalPages = Math.ceil(total / pageSize);

  /** 复制客户ID并显示Toast */
  const handleCopyId = useCallback((id: string) => {
    navigator.clipboard.writeText(id).then(() => {
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2000);
    });
  }, []);

  /** 切换账号状态 */
  const handleToggleStatus = useCallback((id: string) => {
    setStatusMap((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  /** 生成页码 */
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1, 2, 3, 4, 5, 6, '...', totalPages);
    }
    return pages;
  };

  return (
    <div className="customer-list-page">
      {/* ── Toast 提示 ── */}
      <div className={`copy-toast ${toastVisible ? 'toast-visible' : ''}`}>
        <CheckCircleOutlined />
        <span>已复制客户ID</span>
      </div>

      {/* ── 客户ID 浮窗（fixed 定位，不受容器裁剪） ── */}
      {tooltipInfo && (
        <div
          className="cell-id-floating-tooltip"
          style={{ top: tooltipInfo.top, left: tooltipInfo.left }}
        >
          {tooltipInfo.text}
        </div>
      )}

      {/* ── 检索区 ── */}
      <div className="filter-bar">
        <div className="filter-item">
          <div className="filter-select">
            <span className="filter-placeholder">请选择所属组织机构</span>
            <DownOutlined className="filter-arrow" />
          </div>
        </div>
        <div className="filter-item">
          <div className="filter-select">
            <span className="filter-placeholder">请选择上级客户</span>
            <DownOutlined className="filter-arrow" />
          </div>
        </div>
        <div className="filter-item">
          <div className="filter-input">
            <input type="text" placeholder="请输入客户名称" />
            <SearchOutlined className="filter-search-icon" />
          </div>
        </div>
        <div className="filter-item">
          <div className="filter-select">
            <span className="filter-placeholder">请选择客户状态</span>
            <DownOutlined className="filter-arrow" />
          </div>
        </div>
      </div>

      {/* ── 数据表 ── */}
      <div className="table-wrapper">
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th className="col-fixed-left" style={{ width: 50 }}>序号</th>
                <th style={{ width: 130 }}>客户ID</th>
                <th style={{ width: 160 }}>系统显示名</th>
                <th style={{ width: 120 }}>所属行业</th>
                <th style={{ width: 90 }}>下调用户数</th>
                <th style={{ width: 220, minWidth: 180 }}>客户角色</th>
                <th style={{ width: 70 }}>销售</th>
                <th style={{ width: 70 }}>售前</th>
                <th style={{ width: 90 }}>申请人</th>
                <th style={{ width: 90 }}>发送邮箱</th>
                <th style={{ width: 160 }}>注册时间</th>
                <th style={{ width: 160 }}>到期时间</th>
                <th style={{ width: 90 }}>账号状态</th>
                <th className="col-fixed-right" style={{ width: 220 }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {mockData.map((row, idx) => (
                <tr key={row.id} className={idx % 2 === 1 ? 'row-odd' : ''}>
                  <td className="col-center col-fixed-left">{(currentPage - 1) * pageSize + idx + 1}</td>
                  <td>
                    <span
                      className="cell-id"
                      onClick={() => handleCopyId(row.id)}
                      onMouseEnter={(e) => {
                        const rect = (e.target as HTMLElement).getBoundingClientRect();
                        setTooltipInfo({ text: row.id, top: rect.top - 40, left: rect.left + rect.width / 2 });
                      }}
                      onMouseLeave={() => setTooltipInfo(null)}
                    >
                      {row.id.length > 10 ? row.id.substring(0, 10) + '……' : row.id}
                    </span>
                  </td>
                  <td className="col-bold">{row.name}</td>
                  <td>{row.industry}</td>
                  <td className="col-center">{row.users}</td>
                  <td className="col-role-cell">
                    <span className={`cell-role ${row.role.includes('请绝对不要修改') ? 'role-warning' : ''}`}>
                      {row.role}
                    </span>
                  </td>
                  <td className="col-center">{row.sales || '-'}</td>
                  <td className="col-center">{row.presales || '-'}</td>
                  <td className="col-center cell-small">{row.applicant || '-'}</td>
                  <td className="col-center">
                    <span className="link-action">配置邮箱</span>
                  </td>
                  <td className="col-center cell-time">{row.regTime}</td>
                  <td className="col-center cell-time">{row.expTime}</td>
                  <td className="col-center">
                    <div
                      className={`status-toggle ${statusMap[row.id] ? 'toggle-on' : 'toggle-off'}`}
                      onClick={() => handleToggleStatus(row.id)}
                    >
                      <span className="toggle-dot" />
                    </div>
                  </td>
                  <td className="col-center col-fixed-right">
                    <div className="row-actions">
                      <button className="action-btn" title="发送">
                        <SendOutlined />
                        <span>发送</span>
                      </button>
                      <button className="action-btn" title="编辑">
                        <EditOutlined />
                        <span>编辑</span>
                      </button>
                      <button className="action-btn" title="配置" onClick={() => onNavigate?.('customer-config', '客户配置', { customerName: row.name })}>
                        <SettingOutlined />
                        <span>配置</span>
                      </button>
                      <button className="action-btn" title="查看">
                        <EyeOutlined />
                        <span>查看</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 分页 ── */}
      <div className="pagination-bar">
        <span className="pagination-total">共 {total} 条</span>
        <div className="pagination-pages">
          <button
            className="page-btn page-prev"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            &lt;
          </button>
          {getPageNumbers().map((page, idx) =>
            typeof page === 'string' ? (
              <span key={`ellipsis-${idx}`} className="page-ellipsis">...</span>
            ) : (
              <button
                key={page}
                className={`page-btn ${currentPage === page ? 'page-active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            )
          )}
          <button
            className="page-btn page-next"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerList;
