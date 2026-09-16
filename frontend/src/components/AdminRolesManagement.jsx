import React, { useState, useEffect } from 'react';
import { getBackendUrl } from '../utils/api';
import { adminSidebarSections } from '../data/adminModules';
import { Trash2, Edit2 } from 'lucide-react';

export default function AdminRolesManagement() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isFormOpen, setIsFormOpen] = useState(() => {
    return sessionStorage.getItem('adminRolesFormOpen') === 'true';
  });
  
  const [formData, setFormData] = useState(() => {
    const saved = sessionStorage.getItem('adminRolesFormData');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      id: null,
      name: '',
      email: '',
      password: '',
      permissions: []
    };
  });

  // Save to session storage whenever form data or form open state changes
  useEffect(() => {
    sessionStorage.setItem('adminRolesFormOpen', isFormOpen);
  }, [isFormOpen]);

  useEffect(() => {
    sessionStorage.setItem('adminRolesFormData', JSON.stringify(formData));
  }, [formData]);

  const [saving, setSaving] = useState(false);
  
  // Extract all available permissions from the sidebar structure
  const allPermissions = adminSidebarSections.flatMap(section => 
    section.items.map(item => item.path)
  ).filter(path => path !== 'dashboard' && path !== 'settings');

  const fetchEmployees = async () => {
    try {
      const rawAuth = localStorage.getItem('umeed-admin-auth');
      let authData = {};
      let isSuperAdmin = false;
      
      if (rawAuth === 'true') {
        isSuperAdmin = true;
      } else {
        authData = JSON.parse(rawAuth || '{}');
        if (authData.role === 'SuperAdmin') {
          isSuperAdmin = true;
        }
      }
      
      if (!isSuperAdmin) {
        setError('Access denied. SuperAdmin only.');
        setLoading(false);
        return;
      }
      
      const token = localStorage.getItem('umeed-admin-token') || authData.token;

      const res = await fetch(`${getBackendUrl()}/api/v1/admin/employees`, {
        headers: {
          'Authorization': `Bearer ${authData.token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setEmployees(data);
      } else {
        setError(data.message || 'Failed to fetch employees');
      }
    } catch (err) {
      setError('Server error while fetching employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleActionCheckboxChange = (path, action) => {
    const permString = `${path}:${action}`;
    setFormData(prev => {
      let newPerms = [...prev.permissions];
      
      if (newPerms.includes(permString)) {
        newPerms = newPerms.filter(p => p !== permString);
      } else {
        newPerms.push(permString);
        // Auto-select read if another action is selected
        if (action !== 'read' && !newPerms.includes(`${path}:read`)) {
          newPerms.push(`${path}:read`);
        }
      }
      
      // Unchecking read removes all permissions for that module
      if (action === 'read' && !newPerms.includes(permString)) {
        newPerms = newPerms.filter(p => !p.startsWith(`${path}:`));
      }
      
      return { ...prev, permissions: newPerms };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const rawAuth = localStorage.getItem('umeed-admin-auth');
      const authData = rawAuth !== 'true' ? JSON.parse(rawAuth || '{}') : {};
      const token = localStorage.getItem('umeed-admin-token') || authData.token;
      
      const url = formData.id 
        ? `${getBackendUrl()}/api/v1/admin/employees/${formData.id}`
        : `${getBackendUrl()}/api/v1/admin/employees`;
        
      const method = formData.id ? 'PUT' : 'POST';
      
      const payload = { ...formData, role: 'Admin' };
      if (!payload.password && formData.id) {
        delete payload.password;
      }

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (res.ok) {
        fetchEmployees();
        setIsFormOpen(false);
        setFormData({ id: null, name: '', email: '', password: '', permissions: [] });
      } else {
        alert(data.message || 'Failed to save employee');
      }
    } catch (err) {
      alert('Error saving employee');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    
    try {
      const rawAuth = localStorage.getItem('umeed-admin-auth');
      const authData = rawAuth !== 'true' ? JSON.parse(rawAuth || '{}') : {};
      const token = localStorage.getItem('umeed-admin-token') || authData.token;
      
      const res = await fetch(`${getBackendUrl()}/api/v1/admin/employees/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        fetchEmployees();
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete');
      }
    } catch (err) {
      alert('Error deleting employee');
    }
  };

  const handleEdit = (emp) => {
    // Migrate old format to new format on edit
    const migratedPermissions = (emp.permissions || []).map(p => {
      if (!p.includes(':')) return `${p}:read`;
      return p;
    });

    setFormData({
      id: emp._id,
      name: emp.name,
      email: emp.email,
      password: '',
      permissions: migratedPermissions
    });
    setIsFormOpen(true);
  };

  if (loading) return <div className="p-4 text-slate-500">Loading employees...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_20px_rgba(15,23,42,0.06)] mt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Roles & Permissions (Employees)</h2>
          <p className="mt-1 text-sm text-slate-500">Manage sub-admins and their module access.</p>
        </div>
        <button 
          onClick={() => {
            setFormData({ id: null, name: '', email: '', password: '', permissions: [] });
            setIsFormOpen(!isFormOpen);
          }}
          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          {isFormOpen ? 'Cancel' : 'Add Employee'}
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="mt-6 border border-slate-200 rounded-xl p-4 bg-slate-50">
          <h3 className="font-semibold text-slate-800 mb-4">{formData.id ? 'Edit Employee' : 'Create New Employee'}</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full rounded-lg border-slate-300 px-3 py-2 text-sm border" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full rounded-lg border-slate-300 px-3 py-2 text-sm border" placeholder="john@umeed.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password {formData.id && '(Leave empty to keep current)'}</label>
              <input required={!formData.id} type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full rounded-lg border-slate-300 px-3 py-2 text-sm border" placeholder="********" />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">Module Access Permissions</label>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 font-medium text-slate-700">Module</th>
                    <th className="px-4 py-3 font-medium text-slate-700 text-center">Read</th>
                    <th className="px-4 py-3 font-medium text-slate-700 text-center">Write</th>
                    <th className="px-4 py-3 font-medium text-slate-700 text-center">Update</th>
                    <th className="px-4 py-3 font-medium text-slate-700 text-center">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {allPermissions.map(path => (
                    <tr key={path} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-800 capitalize">{path.replace(/-/g, ' ')}</td>
                      {['read', 'write', 'update', 'delete'].map(action => (
                        <td key={action} className="px-4 py-3 text-center">
                          <input 
                            type="checkbox" 
                            className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer w-4 h-4"
                            checked={formData.permissions.includes(`${path}:${action}`) || (action === 'read' && formData.permissions.includes(path))}
                            onChange={() => handleActionCheckboxChange(path, action)}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <button disabled={saving} type="submit" className="rounded-xl bg-slate-900 px-6 py-2 text-sm font-semibold text-white disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Employee'}
          </button>
        </form>
      )}

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-3 py-2.5 font-semibold text-slate-700">Name</th>
              <th className="px-3 py-2.5 font-semibold text-slate-700">Email</th>
              <th className="px-3 py-2.5 font-semibold text-slate-700">Role</th>
              <th className="px-3 py-2.5 font-semibold text-slate-700">Permissions</th>
              <th className="px-3 py-2.5 font-semibold text-slate-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {employees.map(emp => (
              <tr key={emp._id} className="hover:bg-slate-50">
                <td className="px-3 py-3 font-medium text-slate-800">{emp.name}</td>
                <td className="px-3 py-3 text-slate-600">{emp.email}</td>
                <td className="px-3 py-3">
                  <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${emp.role === 'SuperAdmin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                    {emp.role}
                  </span>
                </td>
                <td className="px-3 py-3 text-slate-500">
                  {emp.role === 'SuperAdmin' ? 'All Access' : (emp.permissions?.length || 0) + ' modules'}
                </td>
                <td className="px-3 py-3 text-right">
                  {emp.role !== 'SuperAdmin' && (
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(emp)} className="text-slate-400 hover:text-emerald-600 p-1">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(emp._id)} className="text-slate-400 hover:text-red-600 p-1">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
