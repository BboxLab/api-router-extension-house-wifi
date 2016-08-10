/*!
 * @brief Bbox Javascript API
 *
 * Copyright (c) 2013, 2014, 2015, 2016 Bouygues Telecom
 *
 * The computer program contained herein contains proprietary
 * information which is the property of Bouygues Telecom.
 * The program may be used and/or copied only with the written
 * permission of Bouygues Telecom or in accordance with the
 * terms and conditions stipulated in the agreement/contract under
 *
 * @author Stephane Carrez <stcarrez@bouyguestelecom.fr>
 */
var Bbox = Bbox || {};

var getIpaddress = function() {
	var ip = localStorage.getItem('ipaddress');
	if(ip) {
		return ip;
	}
	else {
		return '192.168.1.254';
	}
};

/**
 * @brief Format the speed in Mbps or Kbps.
 *
 * @param speed the speed to format.
 * @return the formatted speed to display.
 */
function formatSpeed(speed) {
    var n = (speed / 1000);

    if (parseInt(n) > 0) {
        return n.toFixed(2) + ' Mbps';
    } else {
        n = speed;
        return n.toFixed( 2) + ' kbps';
    }
}

function formatDecibel(db) {
    var n = (db / 10);

    return n.toFixed(1) + ' dB';
}

function formatDays(days) {
    if (days > 1) {
        return days + ' ' + Bbox.Messages.page_common_days;
    } else if (days === 1) {
        return days + ' ' + Bbox.Messages.page_common_day;
    } else {
        return '';
    }
}

// add the required nb of prefixed '0' :
function myNumFormat(number, ndigit) {
      var mys = number.toString();
      var prefix = '';
      var length = mys.length;
      for (var i=0; i< ndigit - length; i++) {
          prefix = prefix + '0';
      }
      mys = prefix + mys;
      
      return mys;
    };
    
    function formatTimeStamp(timet)
    {      
      var sadate= new Date(timet * 1000);
      var imonth = sadate.getMonth() + 1;
      var chaine;
      
      chaine = sadate.getDate() + '/' + myNumFormat(imonth,2) + '/' + sadate.getFullYear() + ' à ' + myNumFormat(sadate.getHours(),2) + ' H ' + myNumFormat(sadate.getMinutes(),2);

      return chaine;
    }

    function formatTimeStampInLetters(timet,withMin)
    {      
      var sadate= new Date(timet * 1000);
      var imonth = sadate.getMonth();
      var chaine;
      var tabMonth = [Bbox.Messages.full_month_january,
                      Bbox.Messages.full_month_february,
                      Bbox.Messages.full_month_march,
                      Bbox.Messages.full_month_april,
                      Bbox.Messages.full_month_may,
                      Bbox.Messages.full_month_june,
                      Bbox.Messages.full_month_july,
                      Bbox.Messages.full_month_august,
                      Bbox.Messages.full_month_september,
                      Bbox.Messages.full_month_october,
                      Bbox.Messages.full_month_november,
                      Bbox.Messages.full_month_december];
      chaine = sadate.getDate() + ' ' + tabMonth[imonth] + ' ' + sadate.getFullYear();
      if(withMin) {
          chaine += ' ' + Bbox.Messages.page_calllog_at + ' ' +
          myNumFormat(sadate.getHours(),2) + ' H ' + 
          myNumFormat(sadate.getMinutes(),2);
      }
      return chaine;
    }

/**
 * @brief Add spaces between each 2 char, starting from the end !
 *
 * @param the number as a string (phone number typically)
 * @return the formatted nb to display.
 * if first char is * #, ignore until next *; ignore  also last #/*
 */
function addspaceEach2(number) {
  var s = number + '';
  if (s.length > 4 && s.search(/[0-9]/) !== -1) {
    var i;
    var ms='';
    var last=0;
    var deb=0;
    if (s.substr(deb,1) === '*' || s.substr(deb,1) === '#') {
      // count how many leading char to put as-is
      deb++;
      while(s.substr(deb,1) !== '*' && s.substr(deb,1) !== '#' && deb < 6) {
    deb++;
      }
      deb++;
    }
    
    // check last char
    if (s.substr(s.length -1,1) === '*' || s.substr(s.length -1,1) === '#') {
      last=1;
      ms = s.substr(s.length -1,1);
    }
    
    for (i=s.length-2-last; i>=deb; i-=2) {
      ms = ' ' + s.substring(i, i + 2) + ms;
    }
    if ((s.length - deb - last) %2 !== 0) { // first char alone.
      ms = s.substr(deb,1) + ms;
    }
    if (deb !== 0) {
      ms = s.substr(0,deb) + ms;
    }
    s = ms;
  }
  
  return s;
}
    

function formatHours(days, hours) {
    if (hours > 1) {
        return hours + ' ' + Bbox.Messages.page_common_hours;
    } else if (hours === 1) {
        return hours + ' ' + Bbox.Messages.page_common_hour;
    } else if (days > 0) {
        return '0 ' + Bbox.Messages.page_common_hour;
    } else {
        return '';
    }
}

function formatMins(days, hours, mins) {
    if (mins > 1) {
        return mins + ' ' + Bbox.Messages.page_common_minutes;
    } else if (mins === 1) {
        return mins + ' ' + Bbox.Messages.page_common_minute;
    } else if ((hours > 0) || (days > 0)) {
        return '0 ' + Bbox.Messages.page_common_minute;
    } else {
        return '';
    }
}

var setDebugApi = function(url, op, p, response) {
	/*
   if(sessionStorage && JSON && JSON.stringify && url.indexOf('/api/v1') !== -1) {
	   if(sessionStorage.debugapi === undefined || sessionStorage.debugapi.length > 1000000) {
		  sessionStorage.debugapi = 'timestamp@@type@@url@@data\n';
	   }
	  sessionStorage.debugapi += (new Date().getTime()) + '@@' + op + '@@' + url + p + '@@' + response + "\n";
		if($('#download_result_api').length > 0) {
   			SaveToDisk(sessionStorage.debugapi, 'result_api.csv', $('#download_result_api'));
		}
   }*/
};

$.support.cors = true;
Bbox.createApi = function() {
  var api = {
    fake: 0,

    /**
     * @brief The optional server URI part.
     */
    server: 'http://' + getIpaddress(),
    /**
     * @brief counter of pending post/put/delete operation 
     */
    counter:0,
    /**
     * Div to display number of current pending operation
     */
    displaySave: function() {
        /*var api = this;
        if(api.counter > 0) {
            if(!$('#displaySave').length) {
                Bbox.noticeSave = new jBox('Notice', {
                    animation: {open: 'flip', close: 'move:bottom'},
                    attributes: { x: 'left', y: 'bottom'},
                    content: api.counter + ' modification' + ((api.counter <= 1)?'':'s') + ' en cours',
                    id: 'displaySave'
                });
            }
            else {
                Bbox.noticeSave.setContent(api.counter + ' modification' + ((api.counter <= 1)?'':'s') + ' en cours');
            }
        }
        else if(Bbox.noticeSave && api.counter === 0) {
            setTimeout(function() {
            	Bbox.noticeSave.close({ignoreDelay: true});
            }, 2000);
        }*/
    },
    closeMessage: function() {
        $('#displaySave').css('visibility','hidden');
    },
    /**
     * @brief Get the string value of an HTTP error
     *
     * @param status the HTTP status.
     * @param error the error string.
     * @return error message
     */
    get_error_message: function(status, error) {
        return '';
    },
    error: function(response, callback) {
    	$('.row.title-page').append('<div style="text-align: center;padding: 20px;"><div class="alert-message">L\'adresse IP de la Bbox n\'est pas ' + getIpaddress() + '</div><div>Cliquer <a href="/options.html" target="_blank" style="color: blue;">ici</a> pour la modifier</div></div>')
    },
    /**
     * @brief Handler called after a POST/GET operation failed.
     *
     * @param jqXHDR the XMLHttprequest object.
     * @param status the HTTP status.
     * @param error the error string.
     * @param url the API operation being called.
     * @param callback the API callback.
     * @return nothing
     */
    handle_error: function(jqXHDR, status, error, url, callback) {
    	//console.log(jqXHDR, status, error, url, callback)
	console.log("status:", status,"Error:", error, "url:" , url);
        try {
        	var text = (jqXHDR.responseText.length > 0 ? jQuery.parseJSON(jqXHDR.responseText) : '');
        }
        catch(e) {
        	var text = '';
        }
        var reason = '';
        if(text && text.exception && text.exception.errors && text.exception.errors[0] && text.exception.errors[0].reason) {
            reason = text.exception.errors[0].reason;
        }
        var result, api = this, response = {
            error: error === '' ? 'operation failed': error,
            message: api.get_error_message(jqXHDR.status, error),
            status: jqXHDR.status,
            contentType: jqXHDR.getResponseHeader('Content-type'),
            reason: reason,
            data: null
        };
        if (status === 0) {
            response.message = Bbox.Messages.api_timeout_error;
        }
        return api.error(response, callback);
    },

    /**
     * @brief Call a callback with a response to an ajax request as an argument
     *
     * @param response the response of an ajax request
     * @param callback the callback than will be invoked
     * @return the result of the callbak
     */
    default_error: function(response, callback) {
        return callback(response);
    },
    /**
     * @brief Post a request on the Bbox API
     *
     * @param op the type (GET,POST,PUT,DELETE) of the ajax opration
     * @param url the API URL (without the api/v1 prefix).
     * @param params the post parameters.
     * @param callback the callback operation invoked when the response is received.
     * @return nothing
     */
    operation: function(op, url, params, callback, withCredentials) {
        var api = this;
        if(url.indexOf('login') === -1) {
            api.counter++;
            api.displaySave();
        }
    
        if (api.fake) {
            var response = {
                error: null,
                status: 200,
                contentType: 'application/json',
                data: [{ status: 1 }]
            };
            callback(response);
            return;
        }
        var p = params;
        if($.isArray(params)) {
        	p =  JSON.stringify(params);
        }
        else if (typeof params === 'object') {
            var plist;
            p = '';
            for (var prop in params) {
                if ((typeof params[prop] !== 'undefined') && (params[prop] !== null)) {
                    if (p.length > 0) {
                        p = p + '&';
                    }
                    p = p + prop + '=' + encodeURIComponent(params[prop]);
                }
            }
        }
    	if (url.indexOf('/') !== 0 && url.indexOf('http') !== 0) {
    		url = api.server + '/api/v1/' + url;
    	}
        jQuery.ajax({
            type: op,
            url: url,
            data: p,
            context: document.body,
            crossDomain: true,
            xhrFields:  {
                withCredentials: (withCredentials !== undefined ? withCredentials : true)
            },
            headers: {
                'X-Requested-With': 'XmlHttpRequest'
            },
            /**
             * @brief call when the ajax request success
             *
             * @param data the data send to the ajax operation
             * @param status status of the ajax request
             * @param jqXDR ajax object
             * @return nothing
             */
            success: function(data, status, jqXHDR) {
                if(url.indexOf('login') === -1) {
                    api.counter--;
                    api.displaySave();
                }
                var response = {
                    error: null,
                    message: null,
                    status: jqXHDR.status,
                    contentType: jqXHDR.getResponseHeader('Content-type'),
                    location: jqXHDR.getResponseHeader('Location'),
                    data: data
                };
                setDebugApi(url, op, p, data);
                if(Bbox.PendingErrors) {
                    Bbox.PendingErrors = false;
                    setTimeout(Bbox.closeMessage, 5000);
                }
        		if(callback) {
                    callback(response);
        		}
            },
            /**
             * @brief call when the ajax request failed
             *
             * @param jqXDR ajax object
             * @param status status of the ajax request
             * @param error type of error of the request
             * @return nothing
             */
            error: function(jqXHDR, status, error) {
                setDebugApi(url, op, p, JSON.stringify(error));
                if(url.indexOf('login') === -1) {
                    api.counter--;
                    api.displaySave();
                }
                return api.handle_error(jqXHDR, status, error, url, callback);
        }

        });
    },

    /**
     * @brief Post a request on the Bbox API
     *
     * @param url the API URL (without the api/v1 prefix).
     * @param params the post parameters.
     * @param callback the callback operation invoked when the response is received.
     * @return the result of the ajax operation
     */
      post: function(url, params, callback, withCredentials) {
          if (api.counter === 0 && url.indexOf('login') === -1 && url.indexOf('installation') === -1) {
              api.refreshLogin(function(){});
          }

	  if (url.indexOf('login') === -1 && url.indexOf('installation') === -1 && url.indexOf('bouyguesbox') === -1) {
	      api.epg.token.get(function(response) {
		  var token="";
		  if(!response.error) {
    		      token =  response.data[0].device.token;
		  }
		  return api.operation('POST', url+'?btoken=' + token, params, callback, withCredentials);
    	      });
	      
	  }
	  else {
	      return api.operation('POST', url, params, callback, withCredentials);
	  }
	      
    },

    /**
     * @brief Execute a PUT operation on the Bbox API (update operation).
     *
     * @param url the API URL (without the api/v1 prefix).
     * @param params the post parameters.
     * @param callback the callback operation invoked when the response is received.
     * @return the result of the ajax operation
     */
    put: function(url, params, callback, withCredentials) {
        if (api.counter === 0 && url.indexOf('login') === -1 && url.indexOf('installation') === -1) {
            api.refreshLogin(function(){});
        }
        return api.operation('PUT', url, params, callback, withCredentials);
    },

    /**
     * @brief Execute a DELETE operation on the Bbox API.
     *
     * @param url the API URL (without the api/v1 prefix).
     * @param params the post parameters.
     * @param callback the callback operation invoked when the response is received.
     * @return the result of the ajax operation
     */
    remove: function(url, params, callback) {
        if (api.counter === 0 && url.indexOf('login')===-1 && url.indexOf('installation') === -1) {
            api.refreshLogin(function(){});
        }
        return api.operation('DELETE', url, params, callback);
    },

    /**
     * @brief Get a request on the Bbox API
     *
     * @param url the API URL (without the api/v1 prefix).
     * @param params the optional get parameters.
     * @param callback the callback operation invoked when the response is received.
     * @return nothing
     */
    get: function(url, params, callback, withCredentials) {
        var api = this;
        if (url.indexOf('/') !== 0 && url.indexOf('http') !== 0) {
            url = api.server + '/api/v1/' + url;
        }
        if($('#login-modal').length > 0 && $('#login-modal').css('display')!=='none') {
            callback({error: 401, status: 401});
        	return;
        }
        jQuery.ajax({
            type: 'GET',
            url: url + (params === null ? '' : '?' + params),
            context: document.body,
            crossDomain: true,
            async: true,
            xhrFields:  {
                   withCredentials: (withCredentials !== undefined ? withCredentials : true)
            },
            headers: {
                'X-Requested-With': 'XmlHttpRequest'
            },
            /**
             * @brief call when the ajax request success
             *
             * @param data the data send to the ajax operation
             * @param status status of the ajax request
             * @param jqXDR ajax object
             * @return nothing
             */
           success: function(data, status, jqXHDR) {
                var response = {
                    error: null,
                    message: null,
                    status: jqXHDR.status,
                    contentType: jqXHDR.getResponseHeader('Content-type'),
                    data: data
                };
                setDebugApi(url, 'GET', (params === null ? '' : '?' + params), JSON.stringify(response.data));
                if(Bbox.PendingErrors) {
                    Bbox.PendingErrors = false;
                    setTimeout(Bbox.closeMessage, 5000);
                }
                callback(response);
            },
            /**
             * @brief call when the ajax request failed
             *
             * @param jqXDR ajax object
             * @param status status of the ajax request
             * @param error type of error of the request
             * @return nothing
             */
             error: function(jqXHDR, status, error) {
                return api.handle_error(jqXHDR, status, error, url, callback);
            }
        });
    },

    /**
     * @brief Login to the Bbox API.
     *
     * @param password the user password to login.
     * @param remember_me when set ask to remember the user on this browser.
     * @param callback the callback operation invoked when the response is received.
     * @return the result of a POST request
     */
    login: function(password, remember_me, callback) {
        return api.post('login', { password: password, remember: remember_me ? 1 : 0 }, callback);
    },
    /**
     * @brief call the put login api to refresh the cookie
     * @param callback function called at the end of the ajax request
     * @returns the result of the ajax request
     */
    refreshLogin: function(callback) {
        return api.put('login',null, callback);
    },

    /**
     * @brief Logout from the Bbox API.
     *
     * @param callback the callback operation invoked when the response is received.
     * @return the result of the ajax operation
     */
    logout: function(callback) {
        return api.post('logout', '', callback);
    },

    /**
     * @brief Reset the user password.
     *
     * @param password the new user password to setup.
     * @param callback the callback operation invoked when the response is received.
     * @return the result of the ajax operation
     */
    resetPassword: function(password, callback) {
        return api.post('reset-password', { password: password }, callback);
    },

    /**
     * @brief Reset the user password.
     *
     * @param old_password the old user password.
     * @param password the new user password to setup.
     * @param callback the callback operation invoked when the response is received.
     * @return the result of the ajax operation
     */
    changePassword: function(old_password, password, callback) {
        return api.post('change-password', { old_password: old_password, password: password }, callback);
    },


    /**
     * @brief Create a recovery password and display it on the dot matrix panel (if pincode).
     *
     * @param callback the callback operation invoked when the response is received.
     * @return the result of the ajax operation
     */
    createPasswordRecovery: function(callback) {
          return api.operation('POST', 'password-recovery', '', callback);
    },

      /**

       * @brief Get the recovery password method.
       *
       * @param callback the callback operation invoked when the response is received.
       * @return the result of the ajax operation
       */   
      getPasswordRecoveryMethod: function(callback) {
          return api.get('password-recovery/verify', null, callback);
      },
      
    /**
     * @brief Verify that the pin code is correct.
     *
     * @param code the pin code to verify.
     * @param callback the callback operation invoked when the response is received.
     * @return the result of the ajax operation
     */
      verifyPasswordRecoveryPincode: function(code, callback) {
        return api.post('password-recovery/verify', { pincode: code }, callback);
    },



    /**
     * @brief Create a new pin code and display it on the dot matrix panel.
     *
     * @param callback the callback operation invoked when the response is received.
     * @return the result of the ajax operation
     */
    createPincode: function(callback) {
        return api.post('pincode', '', callback);
    },

    /**
     * @brief Verify that the pin code is correct.
     *
     * @param code the pin code to verify.
     * @param callback the callback operation invoked when the response is received.
     * @return the result of the ajax operation
     */
    verifyPincode: function(code, callback) {
          return api.operation('POST', 'pincode/verify', { pincode: code }, callback);
    },


    /**
     * @brief Reboot the Bbox.
     *
     * @param callback the callback operation invoked when the response is received.
     * @return the result of the ajax operation
     */
    reboot: function(callback) {
        return api.post('device/reboot', '', callback);
    },

    /**
     * @brief Perform a reset factory of the Bbox.
     *
     * @param callback the callback operation invoked when the response is received.
     * @return the result of the ajax operation
     */
    factory: function(callback) {
        return api.post('device/factory', '', callback);
    },

    /**
     * @brief Set the display luminosity.
     *
     * @param level the luminosity level.
     * @param callback the callback operation invoked when the response is received.
     * @return the result of the ajax operation
     */
    setLuminosity: function(level, callback) {
        return api.put('device/display', { luminosity: level }, callback);
    },

    /**
     * @brief Set the display orientation (0 or 180).
     *
     * @param orientation the display orientation.
     * @param callback the callback operation invoked when the response is received.
     * @return the result of the ajax operation
     */
    setOrientation: function(orientation, callback) {
        return api.put('device/display', { orientation: orientation }, callback);
    },
    summary: function(callback) {
        return api.get('summary', null, callback);
    },
    device: {
        /**
         * @brief Get the information on the product (Firmware, hardware, recovery, ...).
         *
         * @param callback the callback operation invoked when the response is received.
         * @return the result of the ajax operation
         */
        get: function(callback) {
            return api.get('device', null, callback);
        },
        /**
         * @brief Get the information on the product (model, serial...).
         *
         * @param callback the callback operation invoked when the response is received.
         * @return the result of the ajax operation
         */
        summary : function(callback) {
            return api.get('device/summary', null, callback);
        },
        /**
         * @brief Get the information on the cpu.
         *
         * @param callback the callback operation invoked when the response is received.
         * @return the result of the ajax operation
         */
        cpu : function(callback) {
            return api.get('device/cpu', null, callback);
        },
        /**
         * @brief Get the information on the memory.
         *
         * @param callback the callback operation invoked when the response is received.
         * @return the result of the ajax operation
         */
        mem : function(callback) {
            return api.get('device/mem', null, callback);
        },
        /**
         * @brief Get the information on saved files.
         *
         * @param callback the callback operation invoked when the response is received.
         * @return the result of the ajax operation
         */
        configs : {
        	get: function(callback) {
                return api.get('configs', null, callback);
            },
            remove: function(id,callback) {
                return api.remove('configs/' + id, {remove: 1}, callback);
            },
            update: function(id, name, callback) {
                return api.put('configs/' + id, {name: name}, callback);
            }
        },
        /**
         * @brief Create a new save file
         *
         * @param callback the callback operation invoked when the response is received.
         * @return the result of the ajax operation
         */
        saveuserconf : function(name, callback) {
            return api.post('configs', { name: name }, callback);
        },
        /**
         * @brief Restore a save file
         *
         * @param name name of the file to restore
         * @param callback the callback operation invoked when the response is received.
         * @return the result of the ajax operation
         */
        restoreuserconf : function(config, callback) {
            return api.post('configs/' + config, {restore: 1}, callback);
        },
        /**
         * @brief Delete a save file
         *
         * @param name the filename to delete.
         * @param callback the callback operation invoked when the response is received.
         * @return the result of the ajax operation
         */
        removeuserconf : function(instance, callback) {
            //return api.put('device/removeuserconf', { remove: name }, callback);
            return api.remove('configs/'+instance, { remove: "delete" }, callback);
        },
        log: function(callback) {
            return api.get('device/log', null, callback);
        }
    },


    /**
     * @brief Get the services information (DHCP, UPnP, DNS).
     *
     * @param callback the callback operation invoked when the response is received.
     * @return the result of the ajax operation
     */
    services: function(callback, config) {
    	config = (config ? 'config=' + config : null)
        return api.get('services', config, callback);
    },
    dns: {
    	get: function(callback) {
            return api.get('dns/stats', null, callback);
        }
    },

    lan: {
        /**
         * @brief Get the information on the LAN.
         *
         * @param callback the callback operation invoked when the response is received.
         * @return the result of the ajax operation
         */
        info: function(callback, config) {
        	config = (config ? 'config=' + config : null)
            return api.get('lan/ip', config, callback);
        },
        /**
         * @brief Set the ip address of the box
         *
         * @param ip the ip address to set
         * @param callback the callback operation invoked when the response is received.
         * @return the result of the ajax operation
         */
        set: function(ip, callback) {
            return api.put('lan', { ipaddress: ip }, callback);
        },
        /**
         * @brief Check if the ip is valid
         *
         * @param ip the ip address to test
         * @param callback the callback operation invoked when the response is received.
         * @return the result of the ajax operation
         */
        check_ip: function(ip, callback) {
            return api.put('lan', { ipaddress: ip, validate: 1 }, callback);
        },
        /**
         * @brief Get stats about the lan
         *
         * @param callback the callback operation invoked when the response is received.
         * @return the result of the ajax operation
         */
        stats: function(callback) {
            return api.get('lan/stats', null, callback);
        }
    },

    wan: {
        /**
         * @brief Get information on the wan
         *
         * @param callback the callback operation invoked when the response is received.
         * @return the result of the ajax operation
         */
        info: function(callback) {
            return api.get('wan/ip', null, callback);
        },
        /**
         * @brief Get statistics on the wan
         *
         * @param callback the callback operation invoked when the response is received.
         * @return the result of the ajax operation
         */
        stats: function(callback) {
            return api.get('wan/ip/stats', null, callback);
        },
        ftth: function(callback) {
            return api.get('wan/ftth/stats', null, callback);
        }
    },

    xdsl: {
        /**
         * @brief Get the xDSL informations.
         *
         * @param callback the callback operation invoked when the response is received.
         * @return the result of the ajax operation
         */
        info: function(callback) {
            return api.get('wan/xdsl', null, callback);
        },
        /**
         * @brief Get the xDSL statistics.
         *
         * @param callback the callback operation invoked when the response is received.
         * @return the result of the ajax operation
         */
        stats: function(callback) {
            return api.get('wan/xdsl/stats', null, callback);
        }
    },

    dhcp: {
        /**
         * @brief Get the DHCP information (ranges, leases, ).
         *
         * @param callback the callback operation invoked when the response is received.
         * @return the result of the ajax operation
         */
        get: function(callback) {
            return api.get('dhcp', null, callback);
        },
        stb: {
            get: function(callback) {
                return api.get('dhcp/stb/options', null, callback);
            }
        },

        /**
         * @brief Set the DHCP information (ranges, leases, ).
         *
         * @param enable bool to indiquate whether the DHCP rule is enable/disable.
         * @param minaddress the min address of the slot.
         * @param maxaddress the max address of the slot.
         * @param lease the lease time in minutes.
         * @param callback the callback operation invoked when the response is received.
         * @return the result of the ajax operation
         */
        set: function(enable, minaddress, maxaddress, lease, callback) {
            return api.put('dhcp', { enable: enable, minaddress: minaddress, maxaddress: maxaddress, leasetime: lease }, callback);
        },

        enable: function(enable, callback) {
            return api.put('dhcp', { enable: enable, minaddress: null, maxaddress: null, leasetime: null}, callback);
        },

        options: {
            /**
             * @brief Create a DHCP option.
             * @param enable bool to indiquate whether the DHCP rule is enable/disable.
             * @param name the name of the rule
             * @param value the value of the rule
             * @param callback the callback operation invoked when the response is received.
             * @return the result of the ajax operation
             */
            create: function(obj, callback) {
                return api.post('dhcp/options', obj, callback);
            },
            /**
             * @brief Delete a DHCP option.
             * @param id the id of the rule
             * @param callback the callback operation invoked when the response is received.
             * @return the result of the ajax operation
             */
            remove: function(id, callback) {
                return api.remove('dhcp/options/' + id, null, callback);
            },
            /**
             * @brief Update a DHCP option.
             * @param id the id of the dhcp option to modify
             * @param enable bool to indiquate whether the DHCP rule is enable/disable.
             * @param name the name of the rule
             * @param value the value of the rule
             * @param callback the callback operation invoked when the response is received.
             * @return the result of the ajax operation
             */
            update: function(id, obj, callback) {
                return api.put('dhcp/options/' + id, obj, callback);
            },
            /**
             * @brief Get a DHCP option.
             * @param id the id of the rule
             * @param callback the callback operation invoked when the response is received.
             * @return the result of the ajax operation
             */
            get: function(id, callback) {
                return api.get('dhcp/options/' + id, null, callback);
            },
            /**
             * @brief List all DHCP option.
             * @param callback the callback operation invoked when the response is received.
             * @return the result of the ajax operation
             */
            list: function(callback, config) {
            	config = (config ? 'config=' + config : null)
                return api.get('dhcp/options', config, callback);
            }
        },

        clients: {
            /**
             * @brief Create the DHCP clients table.
             * @param enable bool to indiquate whether the DHCP client is enable/disable.
             * @param hostname the host of th DHCP client
             * @param mac the mac address of the DHCP client
             * @param ip the ip address of the DHCP client
             * @param callback the callback operation invoked when the response is received.
             * @return the result of the ajax operation
             */
            create: function(obj, callback) {
                return api.post('dhcp/clients', obj, callback);
            },
            /**
             * @brief Remove a DHCP clients table.
             * @param id the id of the DHCP client
             * @param callback the callback operation invoked when the response is received.
             * @return the result of the ajax operation
             */
            remove: function(id, callback) {
                return api.remove('dhcp/clients/' + id, null, callback);
            },
            /**
             * @brief Update the DHCP clients table.
             * @param id the id of the dhcp client
             * @param enable bool to indiquate whether the DHCP client is enable/disable.
             * @param hostname the host of th DHCP client
             * @param mac the mac address of the DHCP client
             * @param ip the ip address of the DHCP client
             * @param callback the callback operation invoked when the response is received.
             * @return the result of the ajax operation
             */
            update: function(id, obj, callback) {
                return api.put('dhcp/clients/' + id, obj, callback);
            },
            /**
             * @brief Get a rule in the DHCP clients table.
             * @param id the id of the DHCP client
             * @param callback the callback operation invoked when the response is received.
             * @return the result of the ajax operation
             */
            get: function(id, callback) {
                return api.get('dhcp/clients/' + id, null, callback);
            },
            /**
             * @brief List all rules in the DHCP clients table.
             * @param callback the callback operation invoked when the response is received.
             * @return the result of the ajax operation
             */
            list: function(callback, config) {
            	config = (config ? 'config=' + config : null)
                return api.get('dhcp/clients', config, callback);
            }
        }
    },

    wireless: {
        ssid24: {
            /**
             * @brief Get information about the WiFi 2.4GHz.
             * @param callback the callback operation invoked when the response is received.
             * @return the result of the ajax operation
             */
            get: function(callback, config) {
            	config = (config ? 'config=' + config : null)
                return api.get('wireless/24', config, callback);
            },
            /**
             * @brief Get statistics about the WiFi 2.4GHz.
             * @param callback the callback operation invoked when the response is received.
             * @return the result of the ajax operation
             */
            stats: function(callback) {
                return api.get('wireless/24/stats', null, callback);
            },
            /**
             * @brief Get scan of the WiFi.
             * @param callback the callback operation invoked when the response is received.
             * @return the result of the ajax operation
             */
            neighborhood: {
            	get: function(callback) {
                    return api.get('wireless/24/neighborhood', null, callback);
                },
            	start: function(callback) {
                    return api.put('wireless/24/neighborhood', null, callback);
                },
            }
        },
        ssid5: {
            /**
             * @brief Get information about the WiFi 5GHz.
             * @param callback the callback operation invoked when the response is received.
             * @return the result of the ajax operation
             */
            get: function(callback, config) {
            	config = (config ? 'config=' + config : null)
                return api.get('wireless/5', config, callback);
            },
            /**
             * @brief Get scan of the WiFi.
             * @param callback the callback operation invoked when the response is received.
             * @return the result of the ajax operation
             */
            neighborhood: {
            	get: function(callback) {
                    return api.get('wireless/5/neighborhood', null, callback);
                },
            	start: function(callback) {
                    return api.put('wireless/5/neighborhood', null, callback);
                },
            }
        },
        /**
         * @brief Set values to the WiFI
         * @param id can be 24 or 5 to indiquate which frequency we want 
         * @param params values of the new wireless data
         * @param callback the callback operation invoked when the response is received.
         * @return the result of the ajax operation
         */
        set: function(id, params, callback) {
            return api.put('wireless/' + id, params, callback);
        },
        /**
         * @brief Enable/Disable the WiFi
         * @param val bool to indiquate whether the WiFi will be enable or disable 
         * @param callback the callback operation invoked when the response is received.
         * @return the result of the ajax operation
         */
        enable: function(val, callback) {
            return api.put('wireless', {'radio.enable':val}, callback);
        },
        /**
         * @brief Get information about the WiFi 2.4GHz and 5GHz.
         * @param callback the callback operation invoked when the response is received.
         * @return the result of the ajax operation
         */
        get: function(callback, config) {
        	config = (config ? 'config=' + config : null)
            return api.get('wireless', config, callback);
        },
	/**
         * @brief Restore factory configuration on Wireless interfaces
         * @return the result of the ajax operation
         */
        remove: function( callback) {
            return api.remove('wireless' , null, callback);
        }
    },
    wps: {
        /**
         * @brief Enable/Disable the WiFi
         * @param val bool to indiquate whether the WiFi will be enable or disable 
         * @param callback the callback operation invoked when the response is received.
         * @return the result of the ajax operation
         */
        enable: function(val,callback) {
            return api.put('wireless', { 'wps.enable': val }, callback);
        },
        /**
         * @brief Start the WPS
         * @param callback the callback operation invoked when the response is received.
         * @return the result of the ajax operation
         */
        start: function(callback) {
            return api.post('wireless/wps', null, callback);
        },
        /**
         * @brief Stop the WPS
         * @param callback the callback operation invoked when the response is received.
         * @return the result of the ajax operation
         */
        stop: function(callback) {
            return api.remove('wireless/wps', null, callback);
        },
        /**
         * @brief Get the status of the WPS
         * @param callback the callback operation invoked when the response is received.
         * @return the result of the ajax operation
         */
        status: function(callback) {
            return api.get('wireless/wps', null, callback);
        }
    },

    upnp: {
        igd: {
            /**
             * @brief Get the UPnP status information.
             *
             * @param callback the callback operation invoked when the response is received.
             * @return the result of the ajax operation
             */
            get: function(callback) {
                return api.get('upnp/igd', null, callback);
            },

            /**
             * @brief Set the UPnP/IGD status information.
             *
             * @param enable enable or disable the UPnP/igd
             * @param callback the callback operation invoked when the response is received.
             * @return the result of the ajax operation
             */
            set: function(enable, callback) {
                return api.put('upnp/igd', { enable: enable }, callback);
            },

            /**
             * @brief List all UPnP/IGD rules.
             *
             * @param callback the callback operation invoked when the response is received.
             * @return the result of the ajax operation
             */
            list: function(callback, config) {
            	config = (config ? 'config=' + config : null)
                return api.get('upnp/igd/rules', config, callback);
            }
        },
        av: {
            /**
             * @brief Get the UPnP status information.
             *
             * @param callback the callback operation invoked when the response is received.
             * @return the result of the ajax request
             */
            get: function(callback) {
                return api.get('upnp/av', null, callback);
            }
        }
    },

    firewall: {
        pingresponder: {
        	get: function(callback) {
                return api.get('firewall/pingresponder', null, callback);
            },
            enable: function(enable, callback) {
                return api.put('firewall/pingresponder', { enable: enable}, callback);
            },
            set: function(obj, callback) {
                return api.put('firewall/pingresponder', obj, callback);
            }
        },
    	/**
         * @brief Get the firewall information.
         *
         * @param callback the callback operation invoked when the response is received.
         * @return the result of the ajax operation
         */
        info: function(callback) {
            return api.get('firewall', null, callback);
        },
        /**
         * @brief Get the list of firewall rules information.
         *
         * @param callback the callback operation invoked when the response is received.
         * @return the result of the ajax operation
         */
        get: function(callback, config) {
        	config = (config ? 'config=' + config : null)
            return api.get('firewall', config, callback);
        },
        rules: {
            /**
             * @brief Create a firewall rule.
             *
             * @param params object containing parameters of a firewall rules
             * @param callback the callback operation invoked when the response is received.
             * @return the result of the ajax operation
             */
            create: function(params, callback) {
                return api.post('firewall/rules', params, callback);
            },
            /**
             * @brief Update a firewall rule.
             *
             * @param id id of the firewall rule
             * @param params object containing parameters of a firewall rules
             * @param callback the callback operation invoked when the response is received.
             * @return the result of the ajax operation
             */
            update: function(id, params, callback) {
                return api.put('firewall/rules/' + id, params, callback);
            },
            /**
             * @brief Remove a firewall rule.
             *
             * @param id id of the firewall rule
             * @param callback the callback operation invoked when the response is received.
             * @return the result of the ajax operation
             */
            remove: function(id, callback) {
                return api.remove('firewall/rules/' + id, null, callback);
            },
            /**
             * @brief List all firewall rules.
             *
             * @param callback the callback operation invoked when the response is received.
             * @return the result of the ajax operation
             */
            list: function(callback, config) {
            	config = (config ? 'config=' + config : null);
                return api.get('firewall/rules', config, callback);
            },
            /**
             * @brief Get information of a firewall rule.
             *
             * @param id id of the firewall rule
             * @param callback the callback operation invoked when the response is received.
             * @return the result of the ajax operation
             */
            get: function(id, callback) {
                return api.get('firewall/rules/' + id, null, callback);
            },
            /**
             * @brief Enable/Disable firewall rules.
             *
             * @param enable boolean
             * @param callback the callback operation invoked when the response is received.
             * @return the result of the ajax operation
             */
            enable: function(enable, callback) {
                return api.put('firewall', { enable: enable}, callback);
            }
        }
    },
    dmz: {
        rules : {
            /**
             * @brief Get the NAT DMZ status information.
             *
             * @param callback the callback operation invoked when the response is received.
             * @return the result of the ajax operation
             */
            list: function(callback) {
                return api.get('nat/dmz', null, callback);
            },

            /**
             * @brief Set the NAT DMZ IP address information.
             *
             * @param enable enable or disable the DMZ.
             * @param ipaddress the IP address to which the DMZ traffic is redirected.
             * @param callback the callback operation invoked when the response is received.
             * @return the result of the ajax operation
             */
            set: function(enable, ipaddress, callback) {
                return api.put('nat/dmz', { enable: enable, ipaddress: ipaddress }, callback);
            },
            /**
             * @brief Remove a DMZ rule
             *
             * @param id id of the NAT rule
             * @param callback the callback operation invoked when the response is received.
             * @return the result of the ajax operation
             */
            remove: function(id, callback) {
                return api.put('nat/dmz', { enable: 0, ipaddress: '' }, callback);
            },
            /**
             * @brief Create a DMZ rule
             *
             * @param params object characterised by his attribute.
             * @param callback the callback operation invoked when the response is received.
             * @return the result of the ajax operation
             */
            create: function(params, callback) {
                return api.put('nat/dmz', params, callback);
            },
            /**
             * @brief Update a DMS rule
             *
             * @param id id of the DMZ rule
             * @param params object characterised by his attribute.
             * @param callback the callback operation invoked when the response is received.
             * @return the result of the ajax operation
             */
            update: function(id, params, callback) {
                return api.put('nat/dmz', params, callback);
            }
        }
    },
    nat: {
        rules: {
            /**
             * @brief Create a NAT rule
             *
             * @param params object characterised by his attribute.
             * @param callback the callback operation invoked when the response is received.
             * @return the result of the ajax operation
             */
            create: function(params, callback) {
                 return api.post('nat/rules', params, callback);
            },
            /**
             * @brief Update a NAT rule
             *
             * @param id id of the NAT rule
             * @param params object characterised by his attribute.
             * @param callback the callback operation invoked when the response is received.
             * @return the result of the ajax operation
             */
            update: function(id, params, callback) {
                 return api.put('nat/rules/' + id, params, callback);
            },
            /**
             * @brief Remove a NAT rule
             *
             * @param id id of the NAT rule
             * @param callback the callback operation invoked when the response is received.
             * @return the result of the ajax operation
             */
            remove: function(id, callback) {
                return api.remove('nat/rules/' + id, null, callback);
            },
            /**
             * @brief List all NAT rules
             *
             * @param callback the callback operation invoked when the response is received.
             * @return the result of the ajax operation
             */
            list: function(callback, config) {
            	config = (config ? 'config=' + config : null)
                return api.get('nat/rules', config, callback);
            },
            /**
             * @brief Get a NAT rule
             *
             * @param id id of the NAT rule
             * @param callback the callback operation invoked when the response is received.
             * @return the result of the ajax operation
             */
            get: function(id, callback) {
                return api.get('nat/rules/' + id, null, callback);
            },
            /**
             * @brief Enable/Disable NAT
             *
             * @param enable 0/1
             * @param callback the callback operation invoked when the response is received.
             * @return the result of the ajax operation
             */
            set: function(enable, callback) {
                return api.put('nat/rules', { enable: enable}, callback);
            }
        }
    },

    /**
     * @brief The DynDNS operations.
     */
    dyndns: {
        rules: {
            /**
             * @brief List all dyndns rules
             *
             * @param callback the callback operation invoked when the response is received.
             * @return the result of the ajax operation
             */
            list: function(callback, config) {
            	config = (config ? 'config=' + config : null)
                return api.get('dyndns', config, callback);
            },
            /**
             * @brief Get a dyndns rule
             *
             * @param id the id of the rule
             * @param callback the callback operation invoked when the response is received.
             * @return the result of the ajax operation
             */
            get: function(id, callback) {
                return api.get('dyndns/' + id, null, callback);
            },
            /**
             * @brief Create a dyndns rule
             *
             * @param params object representing the attributes of the rule
             * @param callback the callback operation invoked when the response is received.
             * @return the result of the ajax operation
             */
            create: function(params, callback) {
                return api.post('dyndns', params, callback);
            },
            /**
             * @brief Update a dyndns rule
             *
             * @param id id of the rule
             * @param params object representing the attributes of the rule
             * @param callback the callback operation invoked when the response is received.
             * @return the result of the ajax operation
             */
            update: function(id, params, callback) {
                return api.put('dyndns/' + id, params, callback);
            },
            /**
             * @brief Remove a dyndns rule
             *
             * @param id id of the rule
             * @param callback the callback operation invoked when the response is received.
             * @return the result of the ajax operation
             */
            remove: function(id, callback) {
                return api.remove('dyndns/' + id, null,callback);
            }
        }
    },

    /**
     * @brief Get the WAN status information (Internet status).
     *
     * @param callback the callback operation invoked when the response is received.
     * @return the result of the ajax request
     */
    wanSummary: function(callback) {
        return api.get('wan/summary', null, callback);
    },

    network_devices: {
        /**
         * @brief Get the network devices which are connected on the LAN.
         *
         * @param callback the callback operation invoked when the response is received.
         * @return the result of the ajax operation
         */
        get: function(callback) {
            return api.get('hosts', null, callback);
        },
        me: function(callback) {
            return api.get('hosts/me', null, callback);
        },

        /**
         * @brief Get the network devices which are connected on the LAN with less information than get.
         *
         * @param callback the callback operation invoked when the response is received.
         * @return the result of the ajax operation
         */
        lite: function(callback) {
            return api.get('hosts/lite', null, callback);
        },
        remove: function(id, callback) {
            return api.remove('hosts/' + id, null, callback);
        },
        getById: function(id, callback) {
            return api.get('hosts/' + id, null, callback);
        },
        ping: function(id, callback) {
            return api.post('hosts/' + id, {action: 'ping'}, callback);
        },
        scan: function(id, callback) {
            return api.post('hosts/' + id, {action: 'scan'}, callback);
        },
        wol: function(id, callback) {
            return api.post('hosts/' + id, {action: 'wakeup'}, callback);
        }
    },

    /**
     * @brief Get the graph information.
     *
     * @param ident the graph to retrieve
     * @param callback the callback operation invoked when the response is received.
     * @return the result of the ajax operation
     */
    graph: function(graph, callback) {
        return api.get('graphs/' + graph, null, callback);
    },

    scheduler: {
        /**
         * @brief List all wifi scheduler rules.
         *
         * @param callback the callback operation invoked when the response is received.
         * @return the result of the ajax operation
         */
        list: function(callback, config) {
        	config = (config ? 'config=' + config : null)
            return api.get('wireless/scheduler', config, callback);
        },
        /**
         * @brief Set a wifi scheduler rule.
         *
         * @param enable enable/disable the rule
         * @param start start hour of the rule
         * @param end end hour of the rule
         * @param occurency occurency of the rule
         * @param callback the callback operation invoked when the response is received.
         * @return the result of the ajax operation
         */
        set: function(enable, start, end, occurency, callback) {
            return api.post('wireless/scheduler', {enable: enable, start: start, end: end, occurency: occurency}, callback);
        },
        /**
         * @brief Enable/disable the wifi scheduler.
         *
         * @param enable enable/disable the wifi scheduler
         * @param callback the function called at the end of the request
         * @return the result of the ajax operation
         */
        enable: function(enable, callback) {
            return api.put('wireless/scheduler', {enable: enable}, callback);
        }
    },

    remote: {
        wolwow : {
            /**
             * @brief Enable/disable the wolwow.
             *
             * @param enable enable/disable the wolwow
             * @param callback the function called at the end of the request
             * @return the result of the ajax operation
             */
            set: function(enable, callback) {
                return api.put('remote/proxywol', {enable: enable}, callback);
            },
	        ip: function(obj, callback) {
	            return api.put('remote/proxywol', obj, callback);
	        }
        },
        admin: {
            /**
             * @brief Enable/disable the remote access.
             *
             * @param enable enable/disable remote access
             * @param callback the function called at the end of the request
             * @return the result of the ajax operation
             */
            enable: function(enable, callback) {
                return api.put('remote/admin', {enable: enable}, callback);
            },
	        set: function(object, callback) {
	            return api.put('remote/admin', object, callback);
	        }
        }
    },

    voip: {
        /**
         * @brief Get the voip information
         *
         * @param callback the callback operation invoked when the response is received.
         * @return the result of the ajax operation
         */
        state: function(callback, config) {
        	config = (config ? 'config=' + config : null)
            return api.get('voip', config, callback);
        },
        /**
         * @brief get call log for Line 1 (default )
         *
         * @param callback the callback operation invoked when the response is received.
         * @return the result of the ajax operation
         */
        calllog: function(line, callback) {
            return api.get('voip/calllog/' + line, null, callback);
        },
        /**
         * @brief get full call log for Line 1 (default )
         *
         * @param callback the callback operation invoked when the response is received.
         * @return the result of the ajax operation
         */
        fullcalllog: function(line, callback) {
            return api.get('voip/fullcalllog/' + line, null, callback);
        },
        /**
         * @brief Call a number
         * @param number the number to call
         * @return the result of the ajax operation
         */
        clicktocall: function(line, number, callback) {
            return api.put('voip/dial', 'line=' + line + '&number=' + number, callback ? callback : function() {});
        },
        removeclicktocall: function(line, callback) {
              return api.remove('voip/dial/' + line, null, callback ? callback : function() {});
        },
    
        /**
         * @brief Remove a call from the calllog
         * @param id the id of the call to remove
         * @return the result of the ajax operation
         */
        remove: function(id, callback) {
          return api.remove('voip/calllog/' + id, null, callback);
        },
    
        /**
         * @brief Block anonymous call
         * @param curstate 
         * @param callback the function called at the end of the request
         * @return the result of the ajax operation
         */
        invertblockanonMode: function(id, curstate, callback) {
          return api.put('voip/blockanon/' + id, 'block=' + curstate,callback);
        },
        /**
         * @brief Call with anonymous number
         * @param curstate 
         * @param callback the function called at the end of the request
         * @return the result of the ajax operation
         */
        invertanonCall: function(curstate, callback) {
          return api.put('voip/anoncall', 'anoncallenb=' + curstate,callback);
        },
        /**
         * @brief Call the current line
         * @param enable start/stop the test
         * @param callback the function called at the end of the request
         * @return the result of the ajax operation
         */
        ringtest: function(line, ring_timeout, callback) {
          return api.post('voip/ringtest' + '/' + line, 'ring_timeout=' + ring_timeout, callback);
        },
        ring: {
        	remove: function(line, callback) {
                return api.remove('voip/ringtest' + '/' + line, null, callback);
            }
        },
        echo: {
        	remove: function(line, callback) {
                return api.remove('voip/echotest' + '/' + line, null, callback);
            }
        },
        /**
         * @brief Call the current line
         * @param enable start/stop the test
         * @param callback the function called at the end of the request
         * @return the result of the ajax operation
         */
        echotest: function(line, ring_timeout, callback) {
          return api.post('voip/echotest' + '/' + line, 'ring_timeout=' + ring_timeout, callback);
        },
        /**
         * @brief Call forward
         * @param mode one of the 3 modes of call forward
         * @param enable start/stop the forwarding
         * @param number the line which receive the call
         * @param callback the function called at the end of the request
         * @return the result of the ajax operation
         */
        voipsetcf: function(mode, enable, number, callback) {
          number = number.replace(/[ \.]/g,'');
          return api.put(mode, 'enable=' + enable + '&number=' + number, callback);
        },
        voicemail: {
        	get: function(callback) {
                return api.get('voip/voicemail', null, callback);
        	},
        	remove: function(line, id, callback) {
                return api.remove('voip/voicemail/' + line + '/' + id, null, callback);
        	},
        	read: function(line, id, callback) {
                return api.put('voip/voicemail/' + line + '/' + id, null, callback);
        	}
        },
        callforward: {
        	get: function(callback) {
                return api.get('voip/callforward', null, callback);
        	},
	    	set: function(id, obj, callback) {
	            return api.put('voip/callforward/' + id, obj, callback);
	    	}
        }
    },
    notification: function(callback) {
        return api.get('voip/diag', null, callback);
    },
    /**
     * @brief Get diagnostics
     * @param callback the function called at the end of the request
     * @return the result of the ajax operation
     */
    diags : function(callback) {
        return api.get('wan/diags', null, callback);
    },
    diagsReset : function(callback) {
        return api.post('wan/diags', {action: 'reset'}, callback);
    },
    diagsStart : function(callback) {
        return api.post('wan/diags', {action: 'start'}, callback);
    },
    printer: {
        /**
         * @brief get printer info
         * @param callback the function called at the end of the request
         * @return the result of the ajax operation
         */
        get: function(callback) {
            return api.get('device/printer', null, callback);
        }
    },
    usb : {
        /**
         * @brief get usb info
         * @param callback the function called at the end of the request
         * @return the result of the ajax operation
         */
        get: function(callback) {
            return api.get('device/usb', null, callback);
        },
        /**
         * @brief get storage info
         * @param callback the function called at the end of the request
         * @return the result of the ajax operation
         */
        storage: function(storage, callback) {
            return api.get('usb/storage' + storage, null, callback);
        },
        /**
         * @brief mount or umount usb
         * @param id the id oh usb port
         * @param umount/mount usb device
         * @param callback the function called at the end of the request
         * @return the result of the ajax operation
         */
        mount: function(id,value,callback) {
            return api.put('device/usb/' + id, 'state=' + value, callback);
        },
        dlna: {
            enable: function(enable,callback) {
                return api.put('device/usb/dlna', {enable: enable}, callback);
            }
        },
        samba: {
            enable: function(enable,callback) {
                return api.put('device/usb/samba', {enable: enable}, callback);
            }
        },
        printer: {
            enable: function(enable,callback) {
                return api.put('device/usb/printer', {enable: enable}, callback);
            }
        }

    },
    acl : {
        rules: {
            /**
             * @brief Create a ACL rule
             *
             * @param params object characterised by his attribute.
             * @param callback the callback operation invoked when the response is received.
             * @return the result of the ajax operation
             */
            create: function(params, callback) {
                 return api.post('wireless/acl/rules', params, callback);
            },
            /**
             * @brief Update a NAT rule
             *
             * @param id id of the ACL rule
             * @param params object characterised by his attribute.
             * @param callback the callback operation invoked when the response is received.
             * @return the result of the ajax operation
             */
            update: function(id, params, callback) {
                 return api.put('wireless/acl/rules/' + id, params, callback);
            },
            /**
             * @brief Remove a ACL rule
             *
             * @param id id of the ACL rule
             * @param callback the callback operation invoked when the response is received.
             * @return the result of the ajax operation
             */
            remove: function(id, callback) {
                return api.remove('wireless/acl/rules/' + id, null, callback);
            },
            /**
             * @brief List all ACL rules
             *
             * @param callback the callback operation invoked when the response is received.
             * @return the result of the ajax operation
             */
            list: function(callback) {
                return api.get('wireless/acl', null, callback);
            },
            /**
             * @brief Get a ACL rule
             *
             * @param id id of the ACL rule
             * @param callback the callback operation invoked when the response is received.
             * @return the result of the ajax operation
             */
            get: function(id, callback) {
                return api.get('wireless/acl/rules/' + id, null, callback);
            },
            /**
             * @brief Enable/Disable ACl
             *
             * @param enable 0/1
             * @param callback the callback operation invoked when the response is received.
             * @return the result of the ajax operation
             */
            set: function(enable, callback) {
                return api.put('wireless/acl', { enable: enable}, callback);
            }
        }
    },
    led: {
        /**
         * @brief Get the led value
         *
         * @param callback the callback operation invoked when the response is received.
         * @return the result of the ajax operation
         */
        get: function(callback) {
            return api.get('device/led', null, callback);
        } 
    },
    parentalcontrol: {
        /**
         * @brief List all wifi scheduler rules.
         *
         * @param callback the callback operation invoked when the response is received.
         * @return the result of the ajax operation
         */
        list: function(callback, config) {
        	config = (config ? 'config=' + config : null)
            return api.get('parentalcontrol/scheduler', config, callback);
        },
        /**
         * @brief Set a wifi scheduler rule.
         *
         * @param enable enable/disable the rule
         * @param start start hour of the rule
         * @param end end hour of the rule
         * @param occurency occurency of the rule
         * @param callback the callback operation invoked when the response is received.
         * @return the result of the ajax operation
         */
        set: function(enable, start, end, callback) {
            return api.post('parentalcontrol/scheduler', {enable: enable, start: start, end: end}, callback);
        },
        /**
         * @brief Enable/disable the wifi scheduler.
         *
         * @param enable enable/disable the wifi scheduler
         * @param callback the function called at the end of the request
         * @return the result of the ajax operation
         */
        policy: function(enable, defaultpolicy, callback) {
        	var obj = {enable: enable};
        	if(defaultpolicy !== null) {
        		obj.defaultpolicy = defaultpolicy;
        	}
            return api.put('parentalcontrol', obj, callback);
        },
        /**
         * @brief Enable/disable the wifi scheduler.
         *
         * @param enable enable/disable the wifi scheduler
         * @param callback the function called at the end of the request
         * @return the result of the ajax operation
         */
        enable: function(enable, callback) {
            var obj = {enable: enable};
            return api.put('parentalcontrol', obj, callback);
        },
        policy: function(enable, defaultpolicy, callback) {
            var obj = {enable: enable};
            if(defaultpolicy !== null) {
                obj.defaultpolicy = defaultpolicy;
            }
            return api.put('parentalcontrol', obj, callback);
        },
        get: function(callback) {
            return api.get('parentalcontrol', null, callback);
        },
        host: function(enable, macaddress, callback) {
            return api.put('parentalcontrol/hosts', {enable: enable, macaddress: macaddress}, callback);
        },
        unblock: function(mac, hour, min, callback) {
            return api.post('parentalcontrol/unblock', {macaddress: mac, hour: hour, minute: min}, callback);
        }
    },
    iptv: {
    	get: function(callback) {
            return api.get('iptv', null, callback);
        },
        diags: {
        	put: function(check, callback) {
                return api.put('iptv/diags', {check: check}, callback);
            },
			get: function(callback) {
		        return api.get('iptv/diags', null, callback);
		    }
        }
    },
    epg: {
    	token: {
        	get: function(callback) {
                return api.get('device/token', null, callback);
            }
    	},
    	info: function(btoken, epgId, startTime, endTime, serial, callback) {
            return api.get('https://webiad.bouyguesbox.fr/epg/events.xml', 'btoken=' + btoken + '&profile=detailed&epgId=' + epgId + '&startTime=' + startTime + '&endTime=' + endTime + '&product=' + serial, callback, false);
    	}
    },
    customerspace: {
    	login: function(login, password, callback) {
            return api.put('profile/account', {login: login, password: password}, callback);
        },
    	refresh: function(action, callback) {
            return api.put('profile/refresh', {action: action}, callback);
        },
        get: function(callback) {
            return api.get('profile/consumption', null, callback);
    	},
        calllog: function(id, callback) {
            return api.get('profile/calllog/' + id, null, callback);
    	},
    	invoice: function(id, session, token, product, callback) {
    		api.get('https://webiad/facture?pg=get_facture&FACTURE_ID=' + id + '&id_session=' + session + '&btoken=' + token + '&product=' + product , null, callback);
    	}
    },
    getMessages: function(lang) {
    	lang = lang || 'fr';
    	  jQuery.ajax({
    		    url: '/js/messages-' + lang + '.json',
    		    success: function(response) {
    		    	Bbox.Messages = response;
    		    },
    		    async:false
    		  });
    },
    rn: function(product, version, token, callback) {
		api.get('https://webiad.bouyguesbox.fr/rn/' + product + '/' + version + '?btoken=' + token + '&product=' + product , null, callback, false);
    },
    vendor: function(tab, product, token, callback) {
		api.post('https://webiad.bouyguesbox.fr/diag/oui?btoken=' + token + '&product=' + product , tab, callback, false);
    },
    conntrack: {
    	session: function(callback) {
    		api.get('wan/diags/sessions', null, callback);
    	},
    	byId: function(id, callback) {
    		api.get('wan/diags/sessions/' + id, null, callback);
    	}
    },
    wally: function(enable, callback) {
        return api.put('hotspot', { enable: enable}, callback);
    },
    notification_contact: {
    	rules: {
            create: function(params, callback) {
                return api.post('notification/contact', params, callback);
            },
            update: function(id, params, callback) {
                return api.put('notification/contact/' + id, params, callback);
            },
            remove: function(id, callback) {
                return api.remove('notification/contact/' + id, null, callback);
            },
            list: function(callback, config) {
            	config = (config ? 'config=' + config : null);
                return api.get('notification/contacts', config, callback);
            },
            enable: function(enable, callback) {
                return api.put('notification/contact', { enable: enable}, callback);
            }
    	}
	},
	    notification_alert: {
	    	rules: {
	            create: function(params, callback) {
	                return api.post('notification/alert', params, callback);
	            },
	            update: function(id, params, callback) {
	                return api.put('notification/alert/' + id, params, callback);
	            },
	            remove: function(id, callback) {
	                return api.remove('notification/alert/' + id, null, callback);
	            },
	            list: function(callback, config) {
	            	config = (config ? 'config=' + config : null);
	                return api.get('notification/alerts', config, callback);
	            },
	            enable: function(enable, callback) {
	                return api.put('notification/alert', { enable: enable}, callback);
	            }
	    	}
    },
    notification_events: {
    	get: function(callback) {
            return api.get('notification/events', null, callback);
    	}
    },
    notification_test: {
    	launch: function(callback) {
            return api.post('notification/test', null, callback);
    	}
    },
    notification_all: {
    	get: function(callback) {
            return api.get('notification', null, callback);
    	},
		enable: function(enable, callback) {
	        return api.put('notification', { enable: enable}, callback);
		}
    }
    
  };
  return api;
};

Bbox.api = Bbox.createApi();
/*Pour contourner le bug safari mobile sur label.for*/
$('label').click(function() {});
