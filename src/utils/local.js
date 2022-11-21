export function getUser() {
    const token = localStorage.getItem('auth_token');
    return token ? JSON.parse(localStorage.getItem('auth_user')) : null;
}
