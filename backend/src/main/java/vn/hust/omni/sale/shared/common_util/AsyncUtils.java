package vn.hust.omni.sale.shared.common_util;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.Collection;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
@Slf4j
public class AsyncUtils {

    public static <T> List<T> getAllCompleted(Collection<CompletableFuture<T>> futuresList, long timeout, TimeUnit unit) {
        CompletableFuture<Void> allFuturesResult = CompletableFuture.allOf(futuresList.toArray(new CompletableFuture[0]));
        try {
            allFuturesResult.get(timeout, unit);
        } catch (Exception e) {
            // you may log it
        }
        return futuresList.stream().filter(future -> future.isDone() && !future.isCompletedExceptionally()) // keep only the ones completed
                .map(CompletableFuture::join) // get the value from the completed future
                .toList(); // collect as a list
    }

    public static <T> CompletableFuture<List<T>> allOf(Collection<CompletableFuture<T>> futures) {
        CompletableFuture<Void> allFuturesResult = CompletableFuture.allOf(futures.toArray(new CompletableFuture[0]));
        return allFuturesResult.thenApply(v -> futures.stream().map(CompletableFuture::join).toList());
    }

}
