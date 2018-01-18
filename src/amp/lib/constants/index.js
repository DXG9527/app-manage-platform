let cfg = {
    UPD_URL: './upd/',
    UPD_PREVIEW_URL: './upd/view.html',
    UMD_URL: './umd/',
    UFD_URL: './ufd/',
    COMPONENT_PREVIEW_URL: './upd/componentPreview.html',
    MENU_URL: [
        '/home', '/umd', '/upd', '/widget', '/param', '/menuDesign'
    ],
    API_BASE_URL: '//dev.ud.itt.space/ud-app-service/',
    USER_NAME: 'admin',
    PASSWORD: 'admin',
    THEME: ['dark', 'light-black', 'light-blue', 'light-red']
};

if (window.UD_APP_CONSTANTS) {
    Object.assign(cfg, window.UD_APP_CONSTANTS);
}
export default cfg;


