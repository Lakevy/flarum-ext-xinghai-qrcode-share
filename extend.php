<?php

/*
 * This extension is deliberately front-end only: QR codes are generated in
 * the visitor's browser and no database tables or server-side routes are used.
 */

return [
    (new Flarum\Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js')
        ->css(__DIR__ . '/resources/less/forum.less'),

    (new Flarum\Extend\Locales(__DIR__ . '/locale')),
];
