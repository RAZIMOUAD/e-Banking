package com.ebanking.core.service.stats;

import com.ebanking.core.domain.base.enums.RoleType;
import com.ebanking.core.dto.stats.StatsResponse;
import com.ebanking.core.repository.sql.UserRepository;
import com.ebanking.core.repository.sql.TransactionRepository;
import com.ebanking.core.repository.sql.UserRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
    public class StatsServiceImpl implements StatsService {

        private final UserRepository userRepository;
        private final TransactionRepository transactionRepository;

        @Override
        public StatsResponse getStats() {
            int totalAgents = userRepository.countByRole(RoleType.AGENT);
            int totalClients = userRepository.countByRole(RoleType.CLIENT);
            int transactionsToday = (int) transactionRepository.countToday();

            return StatsResponse.builder()
                    .totalAgents(totalAgents)
                    .totalClients(totalClients)
                    .transactionsToday(transactionsToday)
                    .build();
        }
    }
