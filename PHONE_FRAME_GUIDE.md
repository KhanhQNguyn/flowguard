# Mobile Device Frame - Usage Guide

## Quick Start

The mobile device frame automatically wraps your app on desktop screens to simulate an iPhone viewing experience.

### For Citizen App

The app is already wrapped and uses max-width constraints. On desktop, you'll see:
- iPhone 14 frame simulation
- Notch at the top
- Realistic shadows and borders
- Mobile-optimized viewport

### For Custom Pages

If you want to use the phone frame wrapper on a custom page:

```tsx
import { PhoneFrameWrapper } from '@/components/layout/phone-frame-wrapper'

export default function CustomPage() {
  return (
    <PhoneFrameWrapper>
      <div className="min-h-screen bg-white">
        {/* Your content */}
      </div>
    </PhoneFrameWrapper>
  )
}
```

## Responsive Behavior

### Desktop (1024px and up)
✓ Shows iPhone frame
✓ Content width: 390px
✓ Height: 844px (iPhone 14)
✓ Shows notch
✓ Includes shadows

### Tablet & Mobile (under 1024px)
✓ Full screen view
✓ No frame
✓ No notch
✓ Natural mobile experience

## Styling

The frame styling is in `/app/mobile-device-frame.css` and includes:

- iPhone-like frame with rounded corners
- Simulated notch using `::before` pseudo-element
- Inset shadows for depth
- Custom scrollbar styling
- Dark background for device aesthetic

## Browser DevTools Alternative

You can also use browser DevTools:
1. Right-click → Inspect
2. Click the device toggle icon
3. Select iPhone 14 Pro (390x844)

This gives you similar mobile preview without the app-level frame.

## Troubleshooting

### Frame not showing on desktop
- Check window width is 1024px or larger
- Verify CSS file is imported: `import './mobile-device-frame.css'`

### Content overflow in frame
- Ensure max-width constraint: `max-w-md` (448px) or `max-w-sm` (384px)
- Check padding doesn't exceed available space

### Scrolling not smooth
- Frame content uses `-webkit-overflow-scrolling: touch`
- Works on all modern browsers

## Customization

To adjust frame dimensions, edit `/app/mobile-device-frame.css`:

```css
.phone-frame {
  width: 390px;      /* Change iPhone width */
  height: 844px;     /* Change iPhone height */
  border-radius: 40px; /* Adjust corners */
  border: 12px solid #1a1a1a; /* Adjust bezel size */
}
```

### Common iPhone Sizes
- iPhone SE: 375x667
- iPhone 12/13: 390x844
- iPhone 14 Pro: 393x852
- iPhone 15 Pro Max: 430x932

## Performance Tips

1. Frame is only rendered on desktop → no mobile overhead
2. Scrolling is GPU-accelerated with `-webkit-overflow-scrolling`
3. CSS is minimal and doesn't affect performance

## Accessibility

- Phone frame is purely visual, doesn't affect screen readers
- All interactive elements remain fully accessible
- Frame hidden from keyboard navigation

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers (frame hidden)
