import Modal from 'flarum/common/components/Modal';
import app from 'flarum/forum/app';
import Button from 'flarum/common/components/Button';
import QRCode from 'qrcode';

export default class QrCodeModal extends Modal {
  oninit(vnode) {
    super.oninit(vnode);

    this.discussion = this.attrs.discussion;
    this.url = this.attrs.url || window.location.href;
    this.shareTitle = this.attrs.shareTitle || (this.discussion && this.discussion.title()) || document.title;
    this.shareText = this.attrs.shareText || `${this.shareTitle}\n${this.url}`;
    this.imageUrl = null;
    this.error = false;
    this.copied = false;
  }

  oncreate(vnode) {
    super.oncreate(vnode);
    this.styleNativeHeader(vnode);
    this.createQrCode();
  }

  styleNativeHeader(vnode) {
    // Use Flarum's one native header and close control, while applying the
    // site's navy-and-gold treatment directly to this modal only.
    const modal = vnode.dom.closest('.Modal');
    if (!modal) return;

    const nativeHeader = modal.querySelector('.Modal-header');
    const nativeTitle = modal.querySelector('.Modal-title, .App-titleControl--text');
    const nativeClose = modal.querySelector('.Modal-close');

    if (nativeHeader) {
      nativeHeader.style.setProperty('background', 'linear-gradient(135deg, #121941 0%, #0d1533 100%)', 'important');
      nativeHeader.style.setProperty('border-bottom-color', 'rgba(243, 199, 124, .32)', 'important');
    }
    if (nativeTitle) {
      nativeTitle.style.setProperty('color', '#fdf5e6', 'important');
      nativeTitle.style.setProperty('font-size', '22px', 'important');
      nativeTitle.style.setProperty('font-weight', '700', 'important');
      nativeTitle.style.setProperty('opacity', '1', 'important');
      nativeTitle.style.setProperty('text-shadow', '0 0 10px rgba(243, 199, 124, .28)', 'important');
    }
    if (nativeClose) nativeClose.style.setProperty('color', '#e8d5b5', 'important');

    if (window.matchMedia('(max-width: 767px)').matches) {
      // This theme positions the native mobile header behind Modal-content.
      // Keep the native element, but place it in the card's top padding layer.
      if (nativeHeader) {
        nativeHeader.style.setProperty('box-sizing', 'border-box', 'important');
        nativeHeader.style.setProperty('border-top-left-radius', '11px', 'important');
        nativeHeader.style.setProperty('border-top-right-radius', '11px', 'important');
        nativeHeader.style.setProperty('display', 'flex', 'important');
        nativeHeader.style.setProperty('height', 'var(--header-height-phone)', 'important');
        nativeHeader.style.setProperty('left', '0', 'important');
        nativeHeader.style.setProperty('position', 'absolute', 'important');
        nativeHeader.style.setProperty('right', '0', 'important');
        nativeHeader.style.setProperty('top', '0', 'important');
        nativeHeader.style.setProperty('width', '100%', 'important');
        nativeHeader.style.setProperty('z-index', '1', 'important');
      }
      if (nativeClose) {
        nativeClose.style.setProperty('left', 'auto', 'important');
        nativeClose.style.setProperty('position', 'absolute', 'important');
        nativeClose.style.setProperty('right', '0', 'important');
        nativeClose.style.setProperty('top', '0', 'important');
        nativeClose.style.setProperty('z-index', '2', 'important');
      }
    }
  }

  className() {
    return 'QrCodeShareModal Modal--small';
  }

  title() {
    return app.translator.trans('liubei-qrcode-share.forum.modal.title');
  }

  async createQrCode() {
    try {
      this.imageUrl = await QRCode.toDataURL(this.url, {
        width: 420,
        margin: 2,
        errorCorrectionLevel: 'M',
        color: { dark: '#101828', light: '#ffffffff' },
      });
    } catch (error) {
      this.error = true;
      // Keep a concise diagnostic for administrators without exposing it in UI.
      console.error('[liubei/qrcode-share] Could not generate QR code', error);
    }

    m.redraw();
  }

  filename() {
    const title = this.shareTitle || 'xinghaihuixiang';
    return `${title.replace(/[\\/:*?"<>|]/g, '-').slice(0, 80)}-qrcode.png`;
  }

  async copyLink(value = this.url) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
      } else {
        const field = document.createElement('textarea');
        field.value = value;
        field.setAttribute('readonly', '');
        field.style.position = 'fixed';
        field.style.opacity = '0';
        document.body.appendChild(field);
        field.select();
        const copied = document.execCommand('copy');
        document.body.removeChild(field);
        if (!copied) throw new Error('Clipboard unavailable');
      }

      this.copied = true;
      m.redraw();
    } catch (error) {
      console.error('[liubei/qrcode-share] Could not copy link', error);
    }
  }

  content() {
    const pageTitle = this.shareTitle;

    return (
      <div className="Modal-body QrCodeShareModal-body">
        <div className="QrCodeShareModal-main">
          <div className="QrCodeShareModal-card">
            <div className="QrCodeShareModal-brand">星海回响</div>
            <div className="QrCodeShareModal-pageTitle">{pageTitle}</div>

            {this.imageUrl ? (
              <img
                className="QrCodeShareModal-image"
                src={this.imageUrl}
                alt={app.translator.trans('liubei-qrcode-share.forum.modal.alt')}
              />
            ) : this.error ? (
              <p className="QrCodeShareModal-error">
                {app.translator.trans('liubei-qrcode-share.forum.modal.error')}
              </p>
            ) : (
              <div className="QrCodeShareModal-loading" aria-label="Loading" />
            )}

            <div className="QrCodeShareModal-hint">
              {app.translator.trans('liubei-qrcode-share.forum.modal.hint')}
            </div>
          </div>

          {this.imageUrl && (
            <div className="Form-group QrCodeShareModal-actions">
              <a className="Button Button--primary" href={this.imageUrl} download={this.filename()}>
                <i className="fas fa-download" />
                {app.translator.trans('liubei-qrcode-share.forum.modal.download')}
              </a>
            </div>
          )}

          <div className="QrCodeShareModal-link">
            {this.attrs.url && <Button className="Button" icon="fas fa-copy" onclick={() => this.copyLink(this.shareText)}>复制标题和链接</Button>}
            <label className="QrCodeShareModal-linkLabel" for="qrcode-share-link">
              {app.translator.trans('liubei-qrcode-share.forum.modal.link_label')}
            </label>
            <div className="QrCodeShareModal-linkControls">
              <input
                id="qrcode-share-link"
                className="FormControl"
                type="text"
                readonly
                value={this.url}
                onclick={(event) => event.currentTarget.select()}
              />
              <Button className="Button Button--default" icon="fas fa-copy" onclick={() => this.copyLink()}>
                {app.translator.trans(
                  this.copied
                    ? 'liubei-qrcode-share.forum.modal.copied'
                    : 'liubei-qrcode-share.forum.modal.copy'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
