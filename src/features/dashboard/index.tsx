import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getAllUsers, getUsersCount } from '../../services/usersService';
import { getAllEvents, getEventsCount } from '../../services/eventsService';
import { getAllRequests, getRequestsCount } from '../../services/musicianRequestsService';
import { getImagesCount } from '../../services/imagesService';
import { useApiRequest } from '../../hooks/useApiRequest';

// Eliminados mocks y función no usada

const metricCards = [
  { label: 'Usuarios', color: 'linear-gradient(90deg, #b993d6 0%, #8ca6db 100%)', path: '/users' },
  { label: 'Eventos', color: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)', path: '/events' },
  { label: 'Solicitudes', color: 'linear-gradient(90deg, #ffaf7b 0%, #d76d77 100%)', path: '/musician-requests' },
  { label: 'Imágenes', color: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)', path: '/images' },
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Métricas
  const {
    data: usersCount,
    loading: loadingUsersCount,
    error: errorUsersCount,
    execute: fetchUsersCount
  } = useApiRequest(getUsersCount);
  const {
    data: eventsCount,
    loading: loadingEventsCount,
    error: errorEventsCount,
    execute: fetchEventsCount
  } = useApiRequest(getEventsCount);
  const {
    data: requestsCount,
    loading: loadingRequestsCount,
    error: errorRequestsCount,
    execute: fetchRequestsCount
  } = useApiRequest(getRequestsCount);
  const {
    data: imagesCount,
    loading: loadingImagesCount,
    error: errorImagesCount,
    execute: fetchImagesCount
  } = useApiRequest(getImagesCount);

  // Recientes y roles
  const {
    data: usersData,
    loading: loadingRecentUsers,
    error: errorRecentUsers,
    execute: fetchRecentUsers
  } = useApiRequest(getAllUsers);
  const {
    data: eventsData,
    loading: loadingRecentEvents,
    error: errorRecentEvents,
    execute: fetchRecentEvents
  } = useApiRequest(getAllEvents);
  const {
    data: requestsData,
    loading: loadingRecentRequests,
    error: errorRecentRequests,
    execute: fetchRecentRequests
  } = useApiRequest(getAllRequests);

  useEffect(() => {
    fetchUsersCount();
    fetchEventsCount();
    fetchRequestsCount();
    fetchImagesCount();
    fetchRecentUsers();
    fetchRecentEvents();
    fetchRecentRequests();
    intervalRef.current = setInterval(() => {
      fetchUsersCount();
      fetchEventsCount();
      fetchRequestsCount();
      fetchImagesCount();
      fetchRecentUsers();
      fetchRecentEvents();
      fetchRecentRequests();
    }, 600000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchUsersCount, fetchEventsCount, fetchRequestsCount, fetchImagesCount, fetchRecentUsers, fetchRecentEvents, fetchRecentRequests]);

  // Procesar datos recientes y roles
  const recentUsers = usersData ? usersData.slice(-3).reverse() : [];
  const recentEvents = eventsData ? eventsData.slice(-3).reverse() : [];
  const recentRequests = requestsData ? requestsData.slice(-3).reverse() : [];
  const rolesDist = usersData ? usersData.reduce((acc: Record<string, number>, u: any) => {
    acc[u.roll] = (acc[u.roll] || 0) + 1;
    return acc;
  }, {}) : {};

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  const handleRefresh = () => {
    fetchUsersCount();
    fetchEventsCount();
    fetchRequestsCount();
    fetchImagesCount();
    fetchRecentUsers();
    fetchRecentEvents();
    fetchRecentRequests();
  };

  // Responsive: detecta si es móvil/tablet
  const isMobile = window.innerWidth <= 900;

  return (
    <div
      style={{
        maxWidth: isMobile ? '100vw' : 900,
        width: isMobile ? '100vw' : '100%',
        minHeight: '100vh',
        margin: isMobile ? 0 : 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: isMobile ? '6vw 0vw' : '6vw 2vw',
        borderRadius: isMobile ? 0 : 18,
        boxShadow: '0 2px 24px #0003',
        background: 'rgba(32,37,52,0.85)',
        color: 'var(--color-text)',
        backdropFilter: 'blur(12px)',
        overflowX: 'hidden',
        boxSizing: 'border-box',
        position: 'relative',
        left: 0,
        top: 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
          gap: 12,
        }}
      >
        <div style={{ fontSize: 'clamp(1rem, 2.5vw, 1.adapte otro componente (por ejemplo, dashboard, eventos, solicitudes, imágenes)2rem)' }}>
          <strong></strong> {user?.email || 'Usuario'}
        </div>
      </div>
      <h2
        style={{
          color: 'var(--color-primary)',
          marginBottom: 32,
          textShadow: '0 2px 12px #00c6a799',
          fontSize: 'clamp(1.3rem, 5vw, 2.2rem)',
          textAlign: 'center',
        }}
      >
        Dashboard principal
      </h2>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 16, width: '100%' }}>
        <button className="btn" style={{ fontSize: 16, padding: '8px 18px', borderRadius: 8 }} onClick={handleRefresh} disabled={loadingUsersCount || loadingEventsCount || loadingRequestsCount || loadingImagesCount}>
          {loadingUsersCount || loadingEventsCount || loadingRequestsCount || loadingImagesCount ? 'Actualizando...' : 'Refrescar'}
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 28, marginBottom: 40 }}>
        <div
          style={{
            background: metricCards[0].color,
            borderRadius: 16,
            boxShadow: '0 4px 24px #b993d655',
            padding: 28,
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
            minWidth: 0,
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
            minHeight: 120,
            ...(loadingUsersCount ? { opacity: 0.6 } : {}),
          }}
          onClick={() => handleCardClick('/users')}
        >
          <div style={{ fontSize: 38, fontWeight: 700, marginBottom: 8, textShadow: '0 2px 12px #fff8' }}>
            {errorUsersCount ? <span style={{color:'#ff5252'}}>{errorUsersCount}</span> : (loadingUsersCount ? '...' : usersCount)}
          </div>
          <div style={{ fontSize: 18, fontWeight: 500 }}>Usuarios</div>
        </div>
        <div
          style={{
            background: metricCards[1].color,
            borderRadius: 16,
            boxShadow: '0 4px 24px #43cea255',
            padding: 28,
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
            minWidth: 0,
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
            minHeight: 120,
            ...(loadingEventsCount ? { opacity: 0.6 } : {}),
          }}
          onClick={() => handleCardClick('/events')}
        >
          <div style={{ fontSize: 38, fontWeight: 700, marginBottom: 8, textShadow: '0 2px 12px #fff8' }}>
            {errorEventsCount ? <span style={{color:'#ff5252'}}>{errorEventsCount}</span> : (loadingEventsCount ? '...' : eventsCount)}
          </div>
          <div style={{ fontSize: 18, fontWeight: 500 }}>Eventos</div>
        </div>
        <div
          style={{
            background: metricCards[2].color,
            borderRadius: 16,
            boxShadow: '0 4px 24px #d76d7755',
            padding: 28,
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
            minWidth: 0,
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
            minHeight: 120,
            ...(loadingRequestsCount ? { opacity: 0.6 } : {}),
          }}
          onClick={() => handleCardClick('/musician-requests')}
        >
          <div style={{ fontSize: 38, fontWeight: 700, marginBottom: 8, textShadow: '0 2px 12px #fff8' }}>
            {errorRequestsCount ? <span style={{color:'#ff5252'}}>{errorRequestsCount}</span> : (loadingRequestsCount ? '...' : requestsCount)}
          </div>
          <div style={{ fontSize: 18, fontWeight: 500 }}>Solicitudes</div>
        </div>
        <div
          style={{
            background: metricCards[3].color,
            borderRadius: 16,
            boxShadow: '0 4px 24px #43e97b55',
            padding: 28,
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
            minWidth: 0,
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
            minHeight: 120,
            ...(loadingImagesCount ? { opacity: 0.6 } : {}),
          }}
          onClick={() => handleCardClick('/images')}
        >
          <div style={{ fontSize: 38, fontWeight: 700, marginBottom: 8, textShadow: '0 2px 12px #fff8' }}>
            {errorImagesCount ? <span style={{color:'#ff5252'}}>{errorImagesCount}</span> : (loadingImagesCount ? '...' : imagesCount)}
          </div>
          <div style={{ fontSize: 18, fontWeight: 500 }}>Imágenes</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center', marginBottom: 32, width: '100%' }}>
        {/* Mini-cards de actividad reciente */}
        <div className="glass-panel" style={{ minWidth: 180, flex: 1, maxWidth: 260 }}>
          <h4 style={{ margin: 0, marginBottom: 8, color: 'var(--color-accent)' }}>Últimos usuarios</h4>
          {loadingRecentUsers ? <div>Cargando...</div> : errorRecentUsers ? <div style={{ color: '#ff5252' }}>{errorRecentUsers}</div> : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {recentUsers.map((u, i) => (
                <li key={u.userEmail || i} style={{ marginBottom: 6, fontSize: '1rem' }}>
                  <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{u.name}</span> <span style={{ color: '#b0b8c1' }}>{u.lastName}</span> <span style={{ fontSize: '0.95em', color: '#888' }}>({u.roll})</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="glass-panel" style={{ minWidth: 180, flex: 1, maxWidth: 260 }}>
          <h4 style={{ margin: 0, marginBottom: 8, color: 'var(--color-accent)' }}>Últimos eventos</h4>
          {loadingRecentEvents ? <div>Cargando...</div> : errorRecentEvents ? <div style={{ color: '#ff5252' }}>{errorRecentEvents}</div> : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {recentEvents.map((e, i) => (
                <li key={e._id || e.name || i} style={{ marginBottom: 6, fontSize: '1rem' }}>
                  <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{e.name || e.title}</span> <span style={{ color: '#b0b8c1' }}>{e.date || e.fecha || e.createdAt || ''}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="glass-panel" style={{ minWidth: 180, flex: 1, maxWidth: 260 }}>
          <h4 style={{ margin: 0, marginBottom: 8, color: 'var(--color-accent)' }}>Últimas solicitudes</h4>
          {loadingRecentRequests ? <div>Cargando...</div> : errorRecentRequests ? <div style={{ color: '#ff5252' }}>{errorRecentRequests}</div> : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {recentRequests.map((r, i) => (
                <li key={r._id || i} style={{ marginBottom: 6, fontSize: '1rem' }}>
                  <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{r.userId || 'Solicitante'}</span> <span style={{ color: '#b0b8c1' }}>{r.status || ''}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Gráfico de roles */}
        <div className="glass-panel" style={{ minWidth: 180, flex: 1, maxWidth: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {loadingRecentUsers ? <div>Cargando...</div> : errorRecentUsers ? <div style={{ color: '#ff5252' }}>{errorRecentUsers}</div> : <RolesPieChart roles={rolesDist} />}
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <span style={{ color: '#00fff7', fontSize: 13 }}>Admin</span>
            <span style={{ color: '#b993d6', fontSize: 13 }}>Organizador</span>
            <span style={{ color: '#ff2eec', fontSize: 13 }}>Músico</span>
          </div>
        </div>
      </div>
      <div
        style={{
          textAlign: 'center',
          color: '#b0b8c1',
          fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)',
          marginTop: 24,
        }}
      >
        Accesos rápidos a los módulos principales del sistema.
      </div>
    </div>
  );
};

// Gráfico circular simple (SVG) para distribución de roles
function RolesPieChart({ roles }: { roles: Record<string, number> }) {
  const total = Object.values(roles).reduce((a, b) => a + b, 0);
  let startAngle = 0;
  const colors = ['#00fff7', '#b993d6', '#ff2eec'];
  const keys = Object.keys(roles);
  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {keys.map((key, i) => {
        const value = roles[key];
        const angle = (value / total) * 360;
        const x1 = 60 + 50 * Math.cos((Math.PI * (startAngle - 90)) / 180);
        const y1 = 60 + 50 * Math.sin((Math.PI * (startAngle - 90)) / 180);
        const x2 = 60 + 50 * Math.cos((Math.PI * (startAngle + angle - 90)) / 180);
        const y2 = 60 + 50 * Math.sin((Math.PI * (startAngle + angle - 90)) / 180);
        const largeArc = angle > 180 ? 1 : 0;
        const d = `M60,60 L${x1},${y1} A50,50 0 ${largeArc} 1 ${x2},${y2} Z`;
        const el = (
          <path key={key} d={d} fill={colors[i % colors.length]} opacity={0.85} />
        );
        startAngle += angle;
        return el;
      })}
      <circle cx="60" cy="60" r="32" fill="#181c24" />
      <text x="60" y="65" textAnchor="middle" fill="#fff" fontSize="1.1rem" fontFamily="Orbitron">Roles</text>
    </svg>
  );
}

export default Dashboard; 