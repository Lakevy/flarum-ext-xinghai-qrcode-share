# liubei/qrcode-share

A lightweight QR-code sharing extension for Flarum 1.8.  It adds a **QR code**
action to the original post's action menu on ordinary discussions and FoF Blog
articles. Replies intentionally do not include an action. The visitor's browser
creates a QR code for the current page URL; no data is sent to the server and
the extension creates no database tables.

## Requirements

- Flarum `^1.8.0` (tested target: 1.8.19)
- PHP 8.3 is supported
- Node.js 18+ is only required to rebuild the front-end source; the release ZIP
  already includes the compiled asset.

## NAS installation

For the supplied local ZIP, run the commands below from the Flarum installation
directory. Replace `/volume1/web/flarum` and `/volume1/homes/admin` with your
actual Flarum and uploaded-ZIP paths. The first command makes an explicit
pre-install backup of Composer's two project files.

```bash
cd /volume1/web/flarum
cp composer.json composer.lock "../flarum-composer-backup-$(date +%F-%H%M%S)"
mkdir -p extensions/liubei-qrcode-share
unzip /volume1/homes/admin/liubei-qrcode-share-1.0.0.zip -d extensions/liubei-qrcode-share
```

Then add this repository entry to the root `composer.json` before the `require`
section (preserve any existing `repositories` entries by adding this object to
the array):

```json
"repositories": [{"type": "path", "url": "extensions/liubei-qrcode-share", "options": {"symlink": false}}]
```

Then install and clear cache as the same account that serves the site. Most
Docker-based NAS Flarum installations use `www-data`; if your container runs a
different service account, substitute that account.

```bash
sudo -u www-data composer require liubei/qrcode-share:@dev
sudo -u www-data php flarum cache:clear
```

Enable **QR Code Share** from the Flarum administration Extensions page.

If Composer cannot accept the path package through `sudo -u www-data`, make the
uploaded extension readable by that account (`chown -R www-data:www-data
extensions/liubei-qrcode-share`) and run the two Composer commands again. Do
not run cache clearing as root.

## Verification

1. Open a normal discussion and a FoF Blog article while logged out and while
   logged in.
2. Open the original post's `…` action menu and choose `二维码`.
3. Confirm the dialog title, page title, `星海回响`, QR image, **保存 PNG**,
   page-link field, and **复制链接** button appear.
4. Scan the saved image with a phone: it must open the exact page URL.
5. Select **复制链接**, then paste into a browser or message to confirm the
   copied URL is complete.

## Rollback

Disable the extension in the admin panel, then run:

```bash
cd /volume1/web/flarum
sudo -u www-data composer remove liubei/qrcode-share
sudo -u www-data php flarum cache:clear
```

Finally delete the added path-repository object from `composer.json`, restore
the pre-install Composer backup if you need a fully exact pre-test state, and
clear cache once more as `www-data`. No database rollback is needed.

## Development build

```bash
cd js
npm ci
npm run build
```

Commit `js/dist/forum.js` with a release so production installations do not
need Node.js.
