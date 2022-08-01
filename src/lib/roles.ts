
/** 
 * Shared API roles on token
 * 
 * @see https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/~/AppRoles/appId/52003e80-b011-42ba-951d-09665b00a719/isMSAApp~/false
 */ 
export enum Roles {
	PortalAdmin = 'Portal.Admin',
    SonosReader = 'Sonos.Reader',
    SonosContributor = 'Sonos.Contributor',
    MinecraftContributor = 'Minecraft.Contributor',
    MinecraftReader = 'Minecraft.Reader',
	FirewallReader = 'Firewall.Reader',
}
