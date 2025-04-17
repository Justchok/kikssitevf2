document.addEventListener('DOMContentLoaded', function() {
    // Fonction pour rendre l'email optionnel dans tous les formulaires
    function makeEmailOptional() {
        // 1. Formulaires HTML standard
        const emailInputs = document.querySelectorAll('input[type="email"][required]');
        emailInputs.forEach(input => {
            // Retirer l'attribut required
            input.removeAttribute('required');
            
            // Ajouter la mention (Recommandé) au label si ce n'est pas déjà fait
            const label = input.previousElementSibling;
            if (label && label.tagName === 'LABEL' && !label.querySelector('.optional')) {
                const span = document.createElement('span');
                span.className = 'optional';
                span.textContent = ' (Recommandé)';
                label.appendChild(span);
            }
        });
        
        // 2. Formulaires générés par SweetAlert2
        // Remplacer les formulaires dans les popups SweetAlert2 qui pourraient être créés après
        const originalSwalFire = window.Swal?.fire;
        if (originalSwalFire) {
            window.Swal.fire = function(options) {
                // Si l'option html contient un formulaire avec email required
                if (options.html && typeof options.html === 'string' && options.html.includes('type="email"') && options.html.includes('required')) {
                    // Remplacer required par rien pour l'email
                    options.html = options.html.replace(/type="email"([^>]*)required/g, function(match, p1) {
                        return 'type="email"' + p1;
                    });
                    
                    // Ajouter le label (Recommandé) pour l'email
                    options.html = options.html.replace(/(<div class="form-group">\s*<input type="email"[^>]*>)/g, 
                        '<div class="form-group">\n<label for="email" style="text-align: left; display: block; margin-bottom: 5px; font-size: 14px;">Email <span style="color: #6c757d; font-size: 12px;">(Recommandé)</span></label>\n$1');
                }
                return originalSwalFire.apply(this, arguments);
            };
        }
    }
    
    // Exécuter la fonction immédiatement
    makeEmailOptional();
    
    // Réexécuter après un délai pour attraper les formulaires générés dynamiquement
    setTimeout(makeEmailOptional, 1000);
});
