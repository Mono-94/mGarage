fx_version 'cerulean'

game 'gta5'

version '2.0.7'

use_experimental_fxv2_oal 'yes'

author 'Raw Paper & MONO'

description 'discord: https://discord.gg/Vk7eY8xYV2 | Documents https://mono-94.github.io/mDocuments/'

lua54 'yes'

shared_scripts {
  '@ox_lib/init.lua',
  '@mVehicle/import.lua',
  'Config.lua',
}

client_scripts {
  'client/**/*',
}

server_scripts {
  '@oxmysql/lib/MySQL.lua',
  'server/**/*',
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

