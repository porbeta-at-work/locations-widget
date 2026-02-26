/**
 * Locations Widget JavaScript
 * Adapted from National Archives Drupal component
 */
(async function($) {
    'use strict';

    // Load locations data from local JSON file
    let locationsData;
    try {
        const response = await fetch('./data/locations.json');
        locationsData = await response.json();
    } catch (error) {
        console.error('Failed to load locations data:', error);
        $('#facility-index').html('<p class="alert alert-danger">Error loading locations data. Please check the network connection and try again.</p>');
        return;
    }

    // Get URL anchor for initial filter state
    const anchor = window.location.href.replace(/.*#/, '');
    let resultList = [];

    // Cache DOM elements
    const $all = $('a#all-filter_static');
    const $research = $('a#research-filter_static');  
    const $frc = $('a#frc-filter_static');
    const $pl = $('a#presidential-libraries-filter_static');
    const $facilityIndex = $('section#facility-index');

    /**
     * Clear active state from all filter buttons
     */
    function clearAllFilters() {
        $all.parent().removeClass('active');
        $research.parent().removeClass('active');
        $frc.parent().removeClass('active');
        $pl.parent().removeClass('active');
    }

    /**
     * Check if a facility has a specific type
     * @param {Object} item - The facility item
     * @param {string} typeName - The type name to check for
     * @returns {boolean}
     */
    function checkIfFacilityType(item, typeName) {
        const facilityTypeList = item['facility_type'] || [];
        return facilityTypeList.some(function(type) {
            return type.name?.toLowerCase() === typeName;
        });
    }

    /**
     * Set result list to show all locations
     */
    function setResultListToAll() {
        resultList = locationsData.response.list;
    }

    /**
     * Set result list to show only research facilities
     */
    function setResultListToResearchOnly() {
        resultList = locationsData.response.list.filter(function(item) {
            return checkIfFacilityType(item, 'research');
        });
    }

    /**
     * Set result list to show only Federal Records Centers
     */
    function setResultListToFRCOnly() {
        resultList = locationsData.response.list.filter(function(item) {
            return checkIfFacilityType(item, 'records');
        });
    }

    /**
     * Set result list to show only Presidential Libraries
     */
    function setResultListToPLOnly() {
        resultList = locationsData.response.list.filter(function(item) {
            return checkIfFacilityType(item, 'presidential');
        });
    }

    /**
     * Get the appropriate icon for a facility based on its type
     * @param {Object} item - The facility item
     * @returns {string} HTML string with icons
     */
    function getFacilityIcon(item) {
        const icon = [];

        if (checkIfFacilityType(item, 'research')) {
            icon.push('<span class="glyphicon glyphicon-search"></span>');
        }

        if (checkIfFacilityType(item, 'records')) {
            icon.push('<span class="glyphicon glyphicon-folder-open"></span>');
        }

        if (checkIfFacilityType(item, 'presidential')) {
            icon.push('<span class="glyphicon glyphicon-book"></span>');
        }

        if (icon.length === 0) {
            icon.push('<span class="glyphicon glyphicon-map-marker"></span>');
        }

        return icon.join(' ');
    }

    /**
     * Get the CSS class for a facility based on its type
     * @param {Object} item - The facility item
     * @returns {string} CSS class name
     */
    function getFacilityCSSClass(item) {
        if (checkIfFacilityType(item, 'presidential')) {
            return 'library';
        } else if (checkIfFacilityType(item, 'records')) {
            return 'records';
        } else if (checkIfFacilityType(item, 'research')) {
            return 'research';
        } else {
            return '';
        }
    }

    /**
     * Create and display the facility list based on current filter
     */
    function loadFacilityIndex() {
        $facilityIndex.empty();

        if (resultList.length > 0) {
            resultList.forEach(function(item, index) {
                // Extract facility information
                const title = item.title || '';
                const addr1 = item.location?.street ? item.location.street + ', ' : '';
                const addr2 = item.location?.additional ? item.location.additional + ', ' : '';
                const city = item.location?.city ? item.location?.city + ', ' : '';
                const state = item.location?.province ? item.location?.province + ' ' : '';
                const zip = item.location?.postal_code ? item.location?.postal_code : '';
                const latitude = item.location?.latitude || '';
                const longitude = item.location?.longitude || '';
                const icon = getFacilityIcon(item);
                const cssClass = getFacilityCSSClass(item);

                const fullAddress = addr1 + addr2 + city + state + zip;

                // Create services list
                const availableServices = item.available_services ? 
                    item.available_services.map(function(service) {
                        return service.name;
                    }).join(', ') : '';

                const website = item.web_site || '';

                // Create facility element
                const facilityItem = $('<div id="facil-' + (index + 1) + '" class="facility ' + cssClass + ' facility-row"></div>');
                facilityItem.append('<div data-facil_index="' + (index + 1) + '"></div>');
                facilityItem.append('<h3>' + icon + ' ' + title + '</h3>');
                facilityItem.append('<address data-latlong="' + latitude + ',' + longitude + '">' + fullAddress + '</address>');
                facilityItem.append('<p><strong>Available services:</strong> ' + availableServices + '</p>');
                
                // Create links with proper URL encoding for addresses
                const encodedAddress = encodeURIComponent(fullAddress);
                const directionsLink = 'https://bing.com/maps/default.aspx?rtp=adr.' + encodedAddress;
                facilityItem.append('<p><a target="_blank" class="directions" href="' + directionsLink + '">Get Directions</a> &middot; <a href="' + website + '" target="_blank">Visit Website</a></p>');

                $facilityIndex.append(facilityItem);
            });
        } else {
            $facilityIndex.append('<p class="alert alert-info">No facilities found for the selected filter.</p>');
        }
    }

    /**
     * Set up event handlers for filter buttons 
     */
    function setupEventHandlers() {
        $all.click(function(e) {
            e.preventDefault();
            clearAllFilters();
            $all.parent().addClass('active');
            setResultListToAll();
            loadFacilityIndex();
            
            // Update URL hash
            window.location.hash = '';
        });

        $research.click(function(e) {
            e.preventDefault();
            clearAllFilters();
            $research.parent().addClass('active');
            setResultListToResearchOnly();
            loadFacilityIndex();
            
            // Update URL hash
            window.location.hash = 'research-facilities';
        });

        $frc.click(function(e) {
            e.preventDefault();
            clearAllFilters();
            $frc.parent().addClass('active');
            setResultListToFRCOnly();
            loadFacilityIndex();
            
            // Update URL hash
            window.location.hash = 'frc';
        });

        $pl.click(function(e) {
            e.preventDefault();
            clearAllFilters();
            $pl.parent().addClass('active');
            setResultListToPLOnly();
            loadFacilityIndex();
            
            // Update URL hash 
            window.location.hash = 'presidential-libraries';
        });
    }

    /**
     * Initialize the widget based on URL anchor or default to all locations
     */
    function initializeWidget() {
        clearAllFilters();

        // Set initial filter based on URL anchor
        if (anchor === 'research-facilities') {
            $research.parent().addClass('active');
            setResultListToResearchOnly();
        } else if (anchor === 'frc') {
            $frc.parent().addClass('active');
            setResultListToFRCOnly();
        } else if (anchor === 'presidential-libraries') {
            $pl.parent().addClass('active');
            setResultListToPLOnly();
        } else {
            $all.parent().addClass('active');
            setResultListToAll();
        }

        // Load the initial facility list
        loadFacilityIndex();
        
        // Set up event handlers
        setupEventHandlers();
        
        console.log('Locations widget initialized with', resultList.length, 'facilities');
    }

    // Initialize the widget when DOM is ready
    $(document).ready(function() {
        initializeWidget();
    });

}(jQuery));