/**
 * ------------------------------------------------
 * ++++++++++++++++Select2Rel++++++++++++++++++++++
 * ------------------------------------------------
 * 
 * This script contains select2 related content
 * (for the form data)
 */


/**
 * Selection of excluded classes for
 * the input data
 */
$(document).ready(function() {
    $('.data-excludecls-form-class').select2({
        placeholder: 'Exclude UniMod Classes'
    });
});