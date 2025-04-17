package vn.hust.omni.sale.shared.common_util;

import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider;
import org.springframework.core.io.DefaultResourceLoader;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class ClassUtils {

    public static <T> List<Class<? extends T>> findAllClassImplementInterface(Class<T> inf, String pkg, ClassLoader classLoader) throws ClassNotFoundException {
        var provider = new ClassPathScanningCandidateComponentProvider(false);
        provider.setResourceLoader(new DefaultResourceLoader(classLoader));

        provider.addIncludeFilter((metadataReader, metadataReaderFactory) -> {
            if (!metadataReader.getClassMetadata().isConcrete()) {
                return false;
            }
            Class<?>[] interfaces;
            try {
                interfaces = org.springframework.util.ClassUtils.getAllInterfacesForClass(Class.forName(metadataReader.getClassMetadata().getClassName()));
            } catch (ClassNotFoundException ignore) {
                return false;
            }
            return Arrays.asList(interfaces).contains(inf);
        });

        var beanDefs = provider.findCandidateComponents(pkg);
        List<Class<? extends T>> list = new ArrayList<>();
        for (BeanDefinition beanDef : beanDefs) {
            var aClass = (Class<? extends T>) Class.forName(beanDef.getBeanClassName());
            list.add(aClass);
        }
        return list;
    }
}
