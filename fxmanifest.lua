fx_version 'cerulean'

game 'gta5'

version '2.0.0'

use_experimental_fxv2_oal 'yes'

lua54 'yes'

shared_scripts {
  '@ox_lib/init.lua',
  '@mVehicle/import.lua',
  'Config.lua',
  'addons/**/Config.lua',

}

client_scripts {
  'client/**/*',
  'addons/**/client/client.lua',
}

server_scripts {
  '@oxmysql/lib/MySQL.lua',
  'server/**/*',
  'addons/**/server/server.lua',
}

files {
  'framework.lua',
  'DefaultGarages.lua',
  'locales/*.json',
  'web/build/index.html',
  'web/build/**/*',
}

ox_libs { 'locale' }

ui_page 'web/build/index.html'

dependencies { 'mVehicle' }
