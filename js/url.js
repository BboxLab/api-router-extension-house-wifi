/*!
 * @brief Bbox url management
 *
 * Copyright (c) 2014, 2015 Bouygues Telecom
 *
 * The computer program contained herein contains proprietary
 * information which is the property of Bouygues Telecom.
 * The program may be used and/or copied only with the written
 * permission of Bouygues Telecom or in accordance with the
 * terms and conditions stipulated in the agreement/contract under
 * which the programs have been supplied.
 *
 * @author Patrice Borne <paborne@bouyguestelecom.fr>
 */
var Bbox = Bbox || {};
var getLanguage = function() {
    var search = location.search;
    if(search.length > 0) {
        var variable = search.split(/[?=&]/);
        var length = variable.length;
        for(var i = 1; i < length; i += 2) {
            if(variable[i] === 'lang') {
                return variable[i + 1];
            }
        }
        return '';
    }
    else {
        return '';
    }
};

var language = getLanguage();
language = (language !== '') ? ('?lang=' + language) : '';
Bbox.url = {
        index: '/index.html' + language,
        login: '/login.html' + language,
        usb: '/usb.html' + language,
        natpat: '/natpat.html' + language,
        firewall: '/firewall.html' + language,
        dyndns: '/dyndns.html' + language,
        cparental: '/controleparental.html' + language,
        dhcp: '/dhcp.html' + language,
        wps: '/wps.html' + language,
        wifi: '/wifi.html' + language,
        diagnostique: '/diagnostic.html' + language,
        calllog: '/page-appels.html'  + language,
        transfertAppels: '/page-appels-param.html'  + language,
        remote: '/remote.html'  + language,
        pwd_change: '/password.html'  + language,
        wan: '/wan.html'  + language,
        bbox: '/bbox.html'  + language,
        ping: '/diag-web.html'  + language,
        neighborhood: '/neighborhood.html'  + language,
        lostpwd: '/lost-password.html'  + language,
        voicemail: '/voicemail.html'  + language,
        saverestore: '/save.html'  + language,
        customerspace: '/customerspace.html'  + language,
        voiptest: '/voiptest.html'  + language,
        webtrack: '/sessions.html'  + language,
        log: '/log.html'  + language,
        wally: '/wally.html'  + language,
        network: '/peripherique.html'  + language,
        diagTV: '/diag-tv.html'  + language,
        diagDNS: '/diag-dns.html'  + language,
        notification: '/notification.html'  + language,
        cs: 'http://www.mon-compte.bouyguestelecom.fr/cas/login'
};

$('.menu-main a:eq(0)').attr('href', Bbox.url.index);
$('.menu-main a:eq(1)').attr('href', Bbox.url.cparental);
$('.menu-main a:eq(2)').attr('href', Bbox.url.diagnostique);
$('.menu-dd li a').eq(0).attr('href', Bbox.url.saverestore);
$('.menu-dd li a').eq(1).attr('href', Bbox.url.customerspace);
$('.menu-dd li a').eq(2).attr('href', Bbox.url.pwd_change);
if(location.pathname !== '/login.html') {
	$('.branding').on('click', function(){
		location.href = Bbox.url.index;
	}).addClass('pointer');
}
$('.menu-dd .dd-panel .list li').remove();
$('.menu-dd .dd-panel .list').append('<li><a href="' + Bbox.url.saverestore + '">Sauvegarde</a></li>')
if($('body').hasClass('feat-customerspace')) {
	$('.menu-dd .dd-panel .list').append('<li><a href="' + Bbox.url.customerspace + '#moncompte">Mon compte</a></li>')
	$('.menu-dd .dd-panel .list').append('<li><a href="' + Bbox.url.customerspace + '">Factures</a></li>')
}
$('.menu-dd .dd-panel .list').append('<li><a href="' + Bbox.url.log + '">Journal des logs</a></li>')
if($('body').hasClass('remote-off')) {
	$('.menu-dd .dd-panel .list').append('<li><a href="' + Bbox.url.pwd_change + '">Changement de mot de passe</a></li>')
}
	