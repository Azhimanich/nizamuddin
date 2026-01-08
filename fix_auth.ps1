# Script to fix localStorage.getItem('auth_token') to getAuthToken() in admin pages

# List of files to fix
$files = @(
    "c:\xampp\htdocs\nizamuddin\frontend\app\admin\whatsapp\page.tsx",
    "c:\xampp\htdocs\nizamuddin\frontend\app\admin\statistics\page.tsx",
    "c:\xampp\htdocs\nizamuddin\frontend\app\admin\specialization-categories\page.tsx",
    "c:\xampp\htdocs\nizamuddin\frontend\app\admin\social-media\page.tsx",
    "c:\xampp\htdocs\nizamuddin\frontend\app\admin\settings\page.tsx",
    "c:\xampp\htdocs\nizamuddin\frontend\app\admin\psb-requirements\page.tsx",
    "c:\xampp\htdocs\nizamuddin\frontend\app\admin\psb-header\page.tsx",
    "c:\xampp\htdocs\nizamuddin\frontend\app\admin\psb-faqs\page.tsx",
    "c:\xampp\htdocs\nizamuddin\frontend\app\admin\profiles\page.tsx"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Processing $file..."
        
        # Read file content
        $content = Get-Content $file -Raw
        
        # Check if getAuthToken import exists
        if ($content -match "import.*getAuthToken.*from") {
            Write-Host "  - getAuthToken already imported"
        } else {
            # Add import after existing imports
            $content = $content -replace "(import.*from.*React.*\n)", "`$1`nimport { getAuthToken } from '@/lib/auth'"
            Write-Host "  - Added getAuthToken import"
        }
        
        # Replace localStorage.getItem('auth_token') with getAuthToken()
        $originalCount = ($content | Select-String "localStorage.getItem\('auth_token'\)" | Measure-Object).Count
        $content = $content -replace "localStorage.getItem\('auth_token'\)", "getAuthToken()"
        
        if ($originalCount -gt 0) {
            Write-Host "  - Replaced $originalCount occurrences of localStorage.getItem('auth_token')"
        }
        
        # Save file
        $content | Out-File $file -Encoding UTF8
        Write-Host "  - File saved"
    } else {
        Write-Host "File not found: $file"
    }
    Write-Host ""
}

Write-Host "Done!"
