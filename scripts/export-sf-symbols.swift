import AppKit
import Foundation

let symbols = [
  "switch.2",
  "translate",
  "circle.lefthalf.filled",
  "chevron.left.forwardslash.chevron.right",
  "person.crop.circle",
  "person.text.rectangle",
  "doc.on.doc",
  "arrow.up.right",
  "arrow.down",
  "command",
  "asterisk",
  "xmark",
  "chart.xyaxis.line",
  "dollarsign",
  "book.closed",
  "bitcoinsign.circle"
]

let destination = URL(fileURLWithPath: CommandLine.arguments[1], isDirectory: true)
try FileManager.default.createDirectory(at: destination, withIntermediateDirectories: true)

for name in symbols {
  guard let source = NSImage(systemSymbolName: name, accessibilityDescription: nil) else {
    fputs("Missing SF Symbol: \(name)\n", stderr)
    continue
  }
  let configuration = NSImage.SymbolConfiguration(pointSize: 64, weight: .medium)
  let image = source.withSymbolConfiguration(configuration) ?? source
  let size = NSSize(width: 128, height: 128)
  let output = NSImage(size: size)
  output.lockFocus()
  NSColor.white.set()
  image.draw(in: NSRect(origin: .zero, size: size), from: .zero, operation: .sourceOver, fraction: 1)
  output.unlockFocus()
  guard let tiff = output.tiffRepresentation,
        let bitmap = NSBitmapImageRep(data: tiff),
        let png = bitmap.representation(using: .png, properties: [:]) else { continue }
  try png.write(to: destination.appendingPathComponent("\(name).png"))
}
