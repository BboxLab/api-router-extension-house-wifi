$('#ipaddress').val(getIpaddress());
$('.btn-submit').on('click', function(e) {
	localStorage.setItem('ipaddress', $('#ipaddress').val());
});
