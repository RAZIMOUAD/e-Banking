package com.ebanking.core.service.user;



import com.ebanking.core.repository.sql.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    /**
     * Méthode utilisée par Spring Security pour charger un utilisateur par identifiant (email ou username).
     */
    @Override
    @Transactional
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        log.debug("Tentative de chargement de l'utilisateur avec identifiant: {}", identifier);

        var user = userRepository.findByEmail(identifier)
                .or(() -> userRepository.findByUsername(identifier))
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur introuvable avec: " + identifier));

        // 🔒 Vérifie si le compte est vérifié (activé)
        if (!user.isVerifie()) {
            log.warn("Utilisateur {} a tenté de se connecter sans avoir activé son compte", identifier);
            throw new IllegalStateException("Votre compte n’a pas encore été activé. Vérifiez vos emails.");
        }

        return user;
    }
}
