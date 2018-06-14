	document.addEventListener('DOMContentLoaded', function() {
		var select = document.querySelectorAll('select');
		var select_instances = M.FormSelect.init(select);
		var datepicker = document.querySelectorAll('.datepicker');
		var datepicker_instances = M.Datepicker.init(datepicker);
	});