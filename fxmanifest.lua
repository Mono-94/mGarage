fx_version 'cerulean'

game 'gta5'

version '2.0.4'

use_experimental_fxv2_oal 'yes'

author 'Raw Paper & MONO'

description 'discord: https://discord.gg/Vk7eY8xYV2 | Documents https://mono-94.github.io/mDocuments/'

lua54 'yes'

shared_scripts {
  '@ox_lib/init.lua',
  '@mVehicle/import.lua',
  'Config.lua',
  'addons/**/Config.lua',
}

client_scripts {
  'client/**/*',
  'addons/**/client/*',
}

server_scripts {
  '@oxmysql/lib/MySQL.lua',
  'server/**/*',
  'addons/**/server/*',
}

files {
  'framework.lua',
  'DefaultGarages.lua',
  'locales/*.json',
  'web/build/index.html',
  'web/build/**/*',
  'web/images/*',
}

ox_libs { 'locale' }

ui_page 'web/build/index.html'

dependency 'mVehicle'


escrow_ignore {
  'framework.lua',
  'Config.lua',
  'DefaultGarages.lua',
  'locales/*.json',
  'server/**/*',
  'client/**/*',
  'web/build/index.html',
  'web/build/**/*',
  'addons/**/Config.lua',
  'addons/**/client/client.lua',
  'addons/**/server/server.lua',
}
