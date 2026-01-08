# Script to fix syntax errors in admin pages

# List of files to fix
$files = @(
    "c:\xampp\htdocs\nizamuddin\frontend\app\admin\whatsapp\page.tsx",
    "c:\xampp\htdocs\nizamuddin\frontend\app\admin\statistics\page.tsx",
    "c:\xampp\htdocs\nizamuddin\frontend\app\admin\specialization-categories\page.tsx",
    "c:\xampp\htdocs\nizamuddin\frontend\app\admin\settings\page.tsx",
    "c:\xampp\htdocs\nizamuddin\frontend\app\admin\psb-header\page.tsx",
    "c:\xampp\htdocs\nizamuddin\frontend\app\admin\psb-faqs\page.tsx",
    "c:\xampp\htdocs\nizamuddin\frontend\app\admin\profiles\page.tsx"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Fixing syntax in $file..."
        
        # Read file content
        $content = Get-Content $file -Raw
        
        # Fix the merged import lines
        $content = $content -replace "import \{ getAuthToken \} from '@/lib/auth'import", "import { getAuthToken } from '@/lib/auth'`nimport"
        
        # Save file
        $content | Out-File $file -Encoding UTF8
        Write-Host "  - Syntax fixed"
    } else {
        Write-Host "File not found: $file"
    }
    Write-Host ""
}

Write-Host "Syntax fixes completed!"
