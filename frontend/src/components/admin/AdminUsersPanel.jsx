// External
import { useState, useEffect, useCallback } from "react";
// Internal — constants & services
import { TOAST_TYPES } from "../../config/constants";
import ConfirmDialog from "../common/ConfirmDialog";
import { Button, Input, Card } from "../base";
import {
  createAdminUser,
  fetchAdminUsers,
  deleteAdminUser,
} from "../../services/api";

// Validation helper

/**
 * Determines whether a given admin account can be deleted.
 * Returns { allowed: boolean, reason: string|null }
 */
const canDeleteAdmin = (targetEmail, currentUserEmail, totalAdmins) => {
  if (targetEmail === currentUserEmail) {
    return { allowed: false, reason: "You cannot remove your own account." };
  }
  if (totalAdmins <= 1) {
    return { allowed: false, reason: "Cannot remove the only administrator." };
  }
  return { allowed: true, reason: null };
};

const EMPTY_ADMIN_FORM = { fullName: "", email: "", password: "" };

// Component

export default function AdminUsersPanel({
  authToken,
  currentUserEmail,
  showToast,
}) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAdminForm, setNewAdminForm] = useState(EMPTY_ADMIN_FORM);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      setUsers(await fetchAdminUsers(authToken));
    } catch (err) {
      showToast(err.message, TOAST_TYPES.ERROR);
    } finally {
      setIsLoading(false);
    }
  }, [authToken, showToast]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleCreateUser = async (event) => {
    event.preventDefault();
    try {
      await createAdminUser(newAdminForm, authToken);
      showToast("Administrator registered.", TOAST_TYPES.SUCCESS);
      setNewAdminForm(EMPTY_ADMIN_FORM);
      setShowAddForm(false);
      await loadUsers();
    } catch (err) {
      showToast(err.message, TOAST_TYPES.ERROR);
    }
  };

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    description: "",
    onConfirm: null,
  });

  const closeConfirmDialog = () =>
    setConfirmDialog((current) => ({
      ...current,
      open: false,
      onConfirm: null,
    }));

  const handleDeleteUser = async (id, email) => {
    const { allowed, reason } = canDeleteAdmin(
      email,
      currentUserEmail,
      users.length,
    );
    if (!allowed) return showToast(reason, TOAST_TYPES.WARNING);

    setConfirmDialog({
      open: true,
      title: "Remove Administrator",
      description: `Remove admin access for ${email}? This action cannot be undone.`,
      onConfirm: async () => {
        closeConfirmDialog();
        try {
          await deleteAdminUser(id, authToken);
          showToast("Admin access removed.", TOAST_TYPES.SUCCESS);
          await loadUsers();
        } catch (err) {
          showToast(err.message, TOAST_TYPES.ERROR);
        }
      },
    });
  };

  return (
    <div className="space-y-6">
      <Card
        className="rounded-[1.75rem] border-cashmere-700 bg-cashmere-900 p-5 shadow-card"
        variant="ghost"
      >
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400">
              Access Control
            </p>
            <h2 className="mt-1 text-xl font-bold text-white">
              Administrators
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Manage staff access and keep the admin workspace secure.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-brass/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.35em] text-brass">
              {users.length} Active
            </span>
            <Button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              size="sm"
              variant={showAddForm ? "outline" : "primary"}
            >
              {showAddForm ? "Cancel" : "Add Admin"}
            </Button>
          </div>
        </div>

        {showAddForm && (
          <form
            onSubmit={handleCreateUser}
            className="mb-4 rounded-[1.25rem] border border-cashmere-700 bg-heritage-900 p-4 space-y-3"
          >
            <div className="flex flex-col gap-1">
              <Input
                label="New Admin Email Address"
                type="email"
                required
                placeholder="Enter admin email address here"
                value={newAdminForm.email}
                onChange={(e) =>
                  setNewAdminForm({ email: e.target.value })
                }
              />
              <p className="text-[11px] text-slate-400 mt-1">
                System will register this email as an eligible administrator. The new admin will create their password upon their first login setup.
              </p>
            </div>
            <Button type="submit" className="mt-2 w-full" fullWidth>
              Assign New Admin
            </Button>
          </form>
        )}

        {isLoading ? (
          <p className="p-6 text-center text-sm text-slate-400">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead>
                <tr className="border-b border-cashmere-700 text-slate-400 text-xs uppercase">
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-cashmere-800 hover:bg-heritage-900"
                  >
                    <td className="p-3 font-bold text-white">
                      {user.fullName}{" "}
                      {user.email === currentUserEmail && (
                        <span className="text-[10px] text-brass">(You)</span>
                      )}
                    </td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">
                      {user.email !== currentUserEmail && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                          onClick={() => handleDeleteUser(user.id, user.email)}
                        >
                          Remove
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        description={confirmDialog.description}
        confirmLabel="Yes, remove"
        cancelLabel="No, keep"
        onConfirm={confirmDialog.onConfirm}
        onCancel={closeConfirmDialog}
      />
    </div>
  );
}
