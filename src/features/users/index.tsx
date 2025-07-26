import { useEffect, useState } from "react";
import type { User } from "../../services/usersService";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUserByEmail,
} from "../../services/usersService";
import { useApiRequest } from "../../hooks/useApiRequest";
import "./Users.css";

const PAGE_SIZE = 10;
const ROLES = ["admin", "organizador", "musico"];

const initialForm: User = {
  name: "",
  lastName: "",
  userEmail: "",
  roll: "musico",
  status: true,
  userPassword: "",
};

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<User>(initialForm);
  const [formError, setFormError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editUserEmail, setEditUserEmail] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{
    email: string;
    name: string;
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  // Hooks para peticiones
  const {
    loading: loadingUsers,
    error: errorUsers,
    execute: fetchUsers,
  } = useApiRequest(getAllUsers);

  const {
    loading: loadingCreate,
    error: errorCreate,
    execute: createUserReq,
  } = useApiRequest(createUser);

  const {
    loading: loadingUpdate,
    error: errorUpdate,
    execute: updateUserReq,
  } = useApiRequest(updateUser);

  const {
    loading: loadingDelete,
    error: errorDelete,
    execute: deleteUser,
  } = useApiRequest(deleteUserByEmail);

  useEffect(() => {
    fetchUsers().then((data) => {
      if (data) setUsers(data);
    });
  }, [fetchUsers]);

  // Filtro de búsqueda
  const filtered = users.filter((u) =>
    (u.name + " " + u.lastName + " " + u.userEmail)
      .toLowerCase()
      .includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Validación simple
  const validate = () => {
    if (!form.name.trim() || !form.lastName.trim() || !form.userEmail.trim())
      return "Completa todos los campos obligatorios.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.userEmail))
      return "Email inválido.";
    if (!editMode && (!form.userPassword?.trim() || form.userPassword.length < 6))
      return "Contraseña mínima 6 caracteres.";
    return "";
  };

  // Guardar usuario (crear o editar)
  const handleSave = async () => {
    setFormError("");
    const err = validate();
    if (err) {
      setFormError(err);
      return;
    }
    try {
      if (editMode && editUserEmail) {
        await updateUserReq(editUserEmail, form);
      } else {
        await createUserReq(form);
      }
      setModalOpen(false);
      setForm(initialForm);
      setEditMode(false);
      setEditUserEmail(null);
      setPage(1);
      // Refresca usuarios
      const data = await fetchUsers();
      if (data) setUsers(data);
    } catch (e) {
      setFormError(
        editMode ? "Error al editar usuario" : "Error al crear usuario"
      );
    }
  };

  // Eliminar usuario
  const handleDelete = async (userEmail: string) => {
    const normalizedEmail = userEmail.trim().toLowerCase();
    console.log(`1: ${normalizedEmail}`);
    setDeleteTarget(normalizedEmail);
    console.log(`2: ${normalizedEmail}`);
    try {
      await deleteUser(normalizedEmail);
      console.log(`3: ${normalizedEmail}`);
      // Refresca usuarios
      const data = await fetchUsers();
      console.log(`4: ${normalizedEmail}`);
      if (data) setUsers(data);
      setConfirmDelete(null);
      console.log(`5: ${normalizedEmail}`);
    } catch (e) {
      // El error se maneja por errorDelete
      console.log("errorDelete");
      console.log(e);
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div
      className="users-container glass-panel"
      style={{ boxShadow: "0 2px 8px #00fff711" }}
    >
      <h2 style={{ marginBottom: 24 }}>Usuarios registrados</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 18,
        }}
      >
        <input
          type="text"
          placeholder="Buscar por nombre, email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={{
            width: 240,
            fontSize: 16,
            borderRadius: 8,
            border: "1.5px solid var(--color-primary)",
            background: "var(--color-glass-strong)",
            color: "#fff",
            padding: "10px 14px",
            marginRight: 12,
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ color: "#b0b8c1", fontSize: 15 }}>
            {filtered.length} usuario{filtered.length !== 1 ? "s" : ""}{" "}
            encontrados
          </div>
          <button
            className="btn"
            style={{
              fontSize: 15,
              padding: "10px 18px",
              borderRadius: 8,
              boxShadow: "0 1px 4px #00fff711",
            }}
            onClick={() => {
              setModalOpen(true);
              setForm(initialForm);
              setFormError("");
              setEditMode(false);
              setEditUserEmail(null);
            }}
          >
            + Nuevo usuario
          </button>
        </div>
      </div>
      {/* Modal sci-fi */}
      {modalOpen && (
        <div className="modal-overlay">
          <div
            className="modal-glass"
            style={{ boxShadow: "0 4px 16px #00fff722" }}
          >
            <h3 style={{ marginBottom: 18, color: "var(--color-primary)" }}>
              {editMode ? "Editar usuario" : "Nuevo usuario"}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <input
                type="text"
                placeholder="Nombre"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                style={{ fontSize: 16 }}
              />
              <input
                type="text"
                placeholder="Apellido"
                value={form.lastName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, lastName: e.target.value }))
                }
                style={{ fontSize: 16 }}
              />
              <input
                type="email"
                placeholder="Email"
                value={form.userEmail}
                onChange={(e) =>
                  setForm((f) => ({ ...f, userEmail: e.target.value }))
                }
                style={{ fontSize: 16 }}
                disabled={editMode}
              />
              <select
                value={form.roll}
                onChange={(e) =>
                  setForm((f) => ({ ...f, roll: e.target.value }))
                }
                style={{ fontSize: 16 }}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <label style={{ color: "#b0b8c1", fontSize: 15 }}>
                <input
                  type="checkbox"
                  checked={form.status}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, status: e.target.checked }))
                  }
                  style={{ marginRight: 8 }}
                />{" "}
                Activo
              </label>
              {!editMode && (
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={form.userPassword}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, userPassword: e.target.value }))
                  }
                  style={{ fontSize: 16 }}
                />
              )}
            </div>
            {formError && (
              <div style={{ color: "#ff5252", margin: "12px 0" }}>
                {formError}
              </div>
            )}
            <div
              style={{
                display: "flex",
                gap: 16,
                marginTop: 18,
                justifyContent: "flex-end",
              }}
            >
              <button
                className="btn"
                style={{
                  background: "var(--color-gradient-3)",
                  boxShadow: "0 1px 4px #00fff711",
                }}
                onClick={() => {
                  setModalOpen(false);
                  setEditMode(false);
                  setEditUserEmail(null);
                }}
                disabled={loadingUpdate || loadingCreate}
              >
                Cancelar
              </button>
              <button
                className="btn"
                style={{
                  background: "var(--color-gradient-2)",
                  boxShadow: "0 1px 4px #00fff711",
                }}
                onClick={handleSave}
                disabled={loadingUpdate || loadingCreate}
              >
                {loadingUpdate || loadingCreate ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
      {loadingUsers && (
        <div style={{ color: "#00fff7", fontWeight: 600, margin: "24px 0" }}>
          Cargando usuarios...
        </div>
      )}
      {errorUsers && (
        <div style={{ color: "#ff5252", margin: "24px 0" }}>{errorUsers}</div>
      )}
      {errorCreate && (
        <div style={{ color: "#ff5252", margin: "18px 0" }}>{errorCreate}</div>
      )}
      {errorUpdate && (
        <div style={{ color: "#ff5252", margin: "18px 0" }}>{errorUpdate}</div>
      )}
      {errorDelete && (
        <div style={{ color: "#ff5252", margin: "18px 0" }}>{errorDelete}</div>
      )}
      {!loadingUsers && !errorUsers && (
        <>
          <div className="users-table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        textAlign: "center",
                        color: "#b0b8c1",
                        fontSize: 17,
                        padding: 32,
                      }}
                    >
                      No hay usuarios para mostrar.
                    </td>
                  </tr>
                ) : (
                  paginated.map((u, i) => (
                    <tr key={i}>
                      <td>{u.name}</td>
                      <td>{u.lastName}</td>
                      <td>{u.userEmail}</td>
                      <td>{u.roll}</td>
                      <td>{u.status ? "Activo" : "Inactivo"}</td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            gap: 12,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <button
                            className="btn"
                            style={{
                              padding: "7px 18px",
                              fontSize: 15,
                              background: "var(--color-gradient-1)",
                              borderRadius: 8,
                              minWidth: 90,
                              boxShadow: "0 1px 4px #00fff711",
                            }}
                            onClick={() => {
                              setModalOpen(true);
                              setEditMode(true);
                              setEditUserEmail(u.userEmail);
                              setForm({
                                name: u.name,
                                lastName: u.lastName,
                                userEmail: u.userEmail,
                                roll: u.roll,
                                status: u.status,
                                userPassword: "",
                              });
                              setFormError("");
                            }}
                          >
                            Editar
                          </button>
                          <button
                            className="btn"
                            style={{
                              padding: "7px 18px",
                              fontSize: 15,
                              background: "var(--color-gradient-3)",
                              borderRadius: 8,
                              minWidth: 90,
                              boxShadow: "0 1px 4px #00fff711",
                            }}
                            onClick={() =>
                              setConfirmDelete({
                                email: u.userEmail,
                                name: u.name + " " + u.lastName,
                              })
                            }
                            disabled={
                              deleteTarget === u.userEmail && loadingDelete
                            }
                          >
                            {deleteTarget === u.userEmail && loadingDelete
                              ? "Eliminando..."
                              : "Eliminar"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Paginación */}
          {totalPages > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 12,
                marginTop: 18,
              }}
            >
              <button
                className="btn"
                style={{ padding: "6px 16px", fontSize: 15 }}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Anterior
              </button>
              <span style={{ color: "#fff", fontWeight: 600, fontSize: 16 }}>
                Página {page} de {totalPages}
              </span>
              <button
                className="btn"
                style={{ padding: "6px 16px", fontSize: 15 }}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
      {/* Modal de confirmación de borrado */}
      {confirmDelete && (
        <div
          className="modal-overlay"
          style={{ animation: "fadeInSciFi 0.25s" }}
        >
          <div
            className="modal-glass sci-fi-modal-alert"
            style={{
              boxShadow: "0 4px 24px #ff525244",
              minWidth: 340,
              maxWidth: 400,
              border: "2px solid var(--color-accent)",
              background: "rgba(32,37,52,0.95)",
              position: "relative",
              animation: "scaleInSciFi 0.25s",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <span
                style={{
                  fontSize: 48,
                  color: "var(--color-accent)",
                  textShadow: "0 0 16px #ff2eec99",
                  marginBottom: 8,
                }}
              >
                ⚠️
              </span>
              <h3
                style={{
                  color: "var(--color-accent)",
                  marginBottom: 10,
                  textAlign: "center",
                  letterSpacing: 1,
                }}
              >
                ¿Eliminar usuario?
              </h3>
            </div>
            <div
              style={{
                color: "#fff",
                marginBottom: 18,
                fontSize: 18,
                textAlign: "center",
                textShadow: "0 2px 8px #ff2eec33",
              }}
            >
              ¿Seguro que deseas eliminar a{" "}
              <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>
                {confirmDelete.name}
              </span>
              ?
            </div>
            {errorDelete && (
              <div
                style={{
                  color: "#ff5252",
                  marginBottom: 10,
                  textAlign: "center",
                }}
              >
                {errorDelete}
              </div>
            )}
            <div
              style={{
                display: "flex",
                gap: 18,
                justifyContent: "center",
                marginTop: 8,
              }}
            >
              <button
                className="btn"
                style={{
                  background: "var(--color-gradient-1)",
                  boxShadow: "0 1px 4px #00fff711",
                  border: "2px solid #00fff7",
                  color: "#fff",
                  fontWeight: 600,
                }}
                onClick={() => setConfirmDelete(null)}
                disabled={deleteTarget === confirmDelete.email && loadingDelete}
              >
                Cancelar
              </button>
              <button
                className="btn"
                style={{
                  background: "var(--color-gradient-3)",
                  boxShadow: "0 1px 4px #ff2eec33",
                  border: "2px solid #ff2eec",
                  color: "#fff",
                  fontWeight: 600,
                }}
                onClick={() => handleDelete(confirmDelete.email)}
                disabled={deleteTarget === confirmDelete.email && loadingDelete}
              >
                {deleteTarget === confirmDelete.email && loadingDelete
                  ? "Eliminando..."
                  : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
